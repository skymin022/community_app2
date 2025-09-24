package com.community.spring.service;

import com.github.pagehelper.PageInfo;
import com.community.spring.domain.Post;
import com.community.spring.dto.PostRequest;

import org.apache.ibatis.annotations.Param;

public interface PostService {
    public Post createPost(@Param("userId") Long userId, PostRequest request) throws Exception;
    public PageInfo<Post> getPosts(@Param("pageNum") int pageNum, @Param("pageSize") int pageSize) throws Exception;
    public Post getPostById(@Param("id") Long id) throws Exception;
    public Post updatePost(@Param("id") Long id, @Param("userId") Long userId, PostRequest request) throws Exception;
    public void deletePost(@Param("id") Long id, @Param("userId") Long userId) throws Exception;
}
