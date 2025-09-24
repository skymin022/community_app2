package com.community.spring.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.community.spring.domain.User;
import com.community.spring.dto.LoginRequest;
import com.community.spring.dto.RegisterRequest;
import com.community.spring.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

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
        String token = userService.login(request);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("token", token);
        response.put("tokenType", "Bearer");
        
        return ResponseEntity.ok(response);
    }
}