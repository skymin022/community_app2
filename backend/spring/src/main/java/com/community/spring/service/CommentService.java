package com.community.spring.service;

import java.util.List;

import com.community.spring.domain.Comment;
import com.community.spring.dto.CommentRequest;

import org.apache.ibatis.annotations.Param;

public interface CommentService {
    public Comment createComment(@Param("postId") Long postId, @Param("userId") Long userId, @Param("request") CommentRequest request) throws Exception;
    public List<Comment> getCommentsByPostId(@Param("postId") Long postId) throws Exception;
    public Comment updateComment(@Param("id") Long id, @Param("userId") Long userId, @Param("request") CommentRequest request) throws Exception;
    public void deleteComment(@Param("id") Long id, @Param("userId") Long userId) throws Exception;
}
