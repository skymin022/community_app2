package com.community.spring.controller;

import com.community.spring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 특정 사용자의 게시글 수 반환
    @GetMapping("/{userId}/posts/count")
    public ResponseEntity<Map<String, Long>> getUserPostCount(@PathVariable("userId") Long userId) {
        long count = userService.countPostsByUserId(userId);
        Map<String, Long> result = new HashMap<>();
        result.put("count", count);
        return ResponseEntity.ok(result);
    }

    // 특정 사용자의 댓글 수 반환
    @GetMapping("/{userId}/comments/count")
    public ResponseEntity<Map<String, Long>> getUserCommentCount(@PathVariable("userId") Long userId) {
        long count = userService.countCommentsByUserId(userId);
        Map<String, Long> result = new HashMap<>();
        result.put("count", count);
        return ResponseEntity.ok(result);
    }

    // 프로필 이미지 업데이트 (로그인 사용자)
    @PutMapping("/profile-image")
    public ResponseEntity<?> updateProfileImage(@RequestBody Map<String, String> body, Principal principal) {
        String username = principal.getName();
        String profileImageUrl = body.get("profileImageUrl");
        userService.updateProfileImage(username, profileImageUrl);
        return ResponseEntity.ok().build();
    }

    // 특정 사용자의 게시글 목록 반환
    @GetMapping("/{userId}/posts")
    public ResponseEntity<?> getUserPosts(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(userService.findPostsByUserId(userId));
    }

    // 특정 사용자의 댓글 목록 반환
    @GetMapping("/{userId}/comments")
    public ResponseEntity<?> getUserComments(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(userService.findCommentsByUserId(userId));
    }
}
