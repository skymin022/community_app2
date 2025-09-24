package com.community.spring.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.community.spring.domain.Comment;
import com.community.spring.dto.CommentRequest;
import com.community.spring.mapper.CommentMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentServiceImpl implements CommentService {
    
    private final CommentMapper commentMapper;
    
    @Override
    public Comment createComment(Long postId, Long userId, CommentRequest request) throws Exception {
        Comment comment = Comment.builder()
                .postId(postId)
                .userId(userId)
                .content(request.getContent())
                .parentId(request.getParentId())
                .isDeleted(false)
                .build();
        
        commentMapper.insertComment(comment);
        return commentMapper.findById(comment.getId());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Comment> getCommentsByPostId(Long postId) throws Exception {
        return commentMapper.findByPostId(postId);
    }
    
    @Override
    public Comment updateComment(Long id, Long userId, CommentRequest request) throws Exception {
        Comment existingComment = commentMapper.findById(id);
        if (existingComment == null || existingComment.isDeleted()) {
            throw new RuntimeException("댓글을 찾을 수 없습니다.");
        }
        
        if (!existingComment.getUserId().equals(userId)) {
            throw new RuntimeException("댓글 수정 권한이 없습니다.");
        }
        
        Comment comment = Comment.builder()
                .id(id)
                .content(request.getContent())
                .build();
        
        commentMapper.updateComment(comment);
        return commentMapper.findById(id);
    }
    
    @Override
    public void deleteComment(Long id, Long userId) throws Exception {
        Comment existingComment = commentMapper.findById(id);
        if (existingComment == null || existingComment.isDeleted()) {
            throw new RuntimeException("댓글을 찾을 수 없습니다.");
        }
        
        if (!existingComment.getUserId().equals(userId)) {
            throw new RuntimeException("댓글 삭제 권한이 없습니다.");
        }
        
        commentMapper.deleteComment(id);
    }
}