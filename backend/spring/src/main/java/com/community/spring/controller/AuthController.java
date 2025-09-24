package com.community.spring.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.community.spring.domain.User;
import com.community.spring.dto.LoginRequest;
import com.community.spring.dto.RegisterRequest;
import com.community.spring.service.UserService;
import com.community.spring.util.JwtAuthenticationFilter.CustomUserPrincipal;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) throws Exception {
        User user = userService.register(request);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "회원가입이 완료되었습니다.");
        response.put("userId", user.getId());
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) throws Exception {
        log.debug("Login attempt for username: {}", request.getUsername());
        String token = userService.login(request);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("token", token);
        response.put("tokenType", "Bearer");

        log.debug("Login successful, token issued: {}", token);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("[AuthController] authentication: " + authentication);
            if (authentication != null && authentication.getPrincipal() instanceof CustomUserPrincipal) {
                CustomUserPrincipal userPrincipal = (CustomUserPrincipal) authentication.getPrincipal();
                System.out.println("[AuthController] userPrincipal: " + userPrincipal);
                Long userId = userPrincipal.getUserId();
                System.out.println("[AuthController] userId: " + userId);
                com.community.spring.domain.User user = userService.getUserById(userId);
                System.out.println("[AuthController] user: " + user);
                if (user == null) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "사용자 정보를 찾을 수 없습니다.");
                    return ResponseEntity.badRequest().body(response);
                }
                return ResponseEntity.ok(user);
            } else {
                System.out.println("[AuthController] 인증 정보 없음 or principal 타입 불일치");
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "인증 정보가 없습니다.");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "사용자 정보를 가져오는 중 오류가 발생했습니다.");
            return ResponseEntity.badRequest().body(response);
        }
    }
}