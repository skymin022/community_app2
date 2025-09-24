package com.community.spring.service;

import java.util.List;

import com.community.spring.domain.Comment;
import com.community.spring.dto.CommentRequest;

public interface CommentService {
    public Comment createComment(Long postId, Long userId, CommentRequest request) throws Exception;
    public List<Comment> getCommentsByPostId(Long postId) throws Exception;
    public Comment updateComment(Long id, Long userId, CommentRequest request) throws Exception;
    public void deleteComment(Long id, Long userId) throws Exception;
}
