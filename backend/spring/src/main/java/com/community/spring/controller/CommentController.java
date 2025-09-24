package com.community.spring.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.community.spring.domain.Comment;
import com.community.spring.dto.CommentRequest;
import com.community.spring.service.CommentService;
import com.community.spring.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CommentController {
    
    private final CommentService commentService;
    private final JwtUtil jwtUtil;
    
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long postId) throws Exception {
        List<Comment> comments = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }
    
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<Map<String, Object>> createComment(
            @PathVariable Long postId,
            @Valid @RequestBody CommentRequest request,
            HttpServletRequest httpRequest) {
        
        try {
            Long userId = getUserIdFromToken(httpRequest);
            Comment comment = commentService.createComment(postId, userId, request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "댓글이 작성되었습니다.");
            response.put("commentId", comment.getId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PutMapping("/comments/{id}")
    public ResponseEntity<Map<String, Object>> updateComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentRequest request,
            HttpServletRequest httpRequest) {
        
        try {
            Long userId = getUserIdFromToken(httpRequest);
            Comment comment = commentService.updateComment(id, userId, request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "댓글이 수정되었습니다.");
            response.put("comment", comment);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Map<String, Object>> deleteComment(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {
        
        try {
            Long userId = getUserIdFromToken(httpRequest);
            commentService.deleteComment(id, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "댓글이 삭제되었습니다.");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    private Long getUserIdFromToken(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            return jwtUtil.getUserIdFromToken(token);
        }
        throw new RuntimeException("인증이 필요합니다.");
    }
}