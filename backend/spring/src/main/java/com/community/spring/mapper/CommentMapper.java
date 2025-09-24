package com.community.spring.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.community.spring.domain.Comment;
@Mapper
public interface CommentMapper {
    public void insertComment(Comment comment) throws Exception;
    public List<Comment> findByPostId(@Param("postId") Long postId) throws Exception;
    public Comment findById(@Param("id") Long id) throws Exception;
    public void updateComment(Comment comment) throws Exception;
    public void deleteComment(@Param("id") Long id) throws Exception;
}
