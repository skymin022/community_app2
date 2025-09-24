package com.community.spring.service;

import com.community.spring.domain.User;
import com.community.spring.dto.LoginRequest;
import com.community.spring.dto.RegisterRequest;

import org.apache.ibatis.annotations.Param;

public interface UserService {
    public User register(RegisterRequest request) throws Exception;
    public String login(LoginRequest request) throws Exception;
    public User getUserById(@Param("id") Long id) throws Exception;
    public User getUserByUsername(@Param("username") String username) throws Exception;
    public void updateUser(@Param("id") Long id, User user) throws Exception;
    public void deleteUser(@Param("id") Long id) throws Exception;

    // 사용자 게시글/댓글 수
        long countPostsByUserId(@Param("userId") Long userId);
        long countCommentsByUserId(@Param("userId") Long userId);

    // 프로필 이미지 업데이트
    void updateProfileImage(String username, String profileImageUrl);

    // 내 게시글/댓글 목록 조회
        java.util.List<com.community.spring.domain.Post> findPostsByUserId(@Param("userId") Long userId);
        java.util.List<com.community.spring.domain.Comment> findCommentsByUserId(@Param("userId") Long userId);
}
