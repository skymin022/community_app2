package com.community.spring.mapper;



import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.community.spring.domain.User;

@Mapper
public interface UserMapper {
    public void insertUser(User user) throws Exception;
    public User findByUsername(@Param("username") String username) throws Exception;
    public User findByEmail(@Param("email") String email) throws Exception;
    public User findById(@Param("id") Long id) throws Exception;
    public void updateUser(User user) throws Exception;
    public void deleteUser(@Param("id") Long id) throws Exception;

    // 게시글/댓글 수
    long countPostsByUserId(@Param("userId") Long userId);
    long countCommentsByUserId(@Param("userId") Long userId);

    // 프로필 이미지 업데이트
    void updateProfileImage(@Param("username") String username, @Param("profileImageUrl") String profileImageUrl);

    // 내 게시글/댓글 목록 조회 (Post/Comment 도메인 반환)
    java.util.List<com.community.spring.domain.Post> findPostsByUserId(@Param("userId") Long userId);
    java.util.List<com.community.spring.domain.Comment> findCommentsByUserId(@Param("userId") Long userId);
}


