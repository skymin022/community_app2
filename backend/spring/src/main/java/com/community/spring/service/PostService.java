package com.community.spring.service;

import com.github.pagehelper.PageInfo;
import com.community.spring.domain.Post;
import com.community.spring.dto.PostRequest;

public interface PostService {
    public Post createPost(Long userId, PostRequest request) throws Exception;
    public PageInfo<Post> getPosts(int pageNum, int pageSize) throws Exception;
    public Post getPostById(Long id) throws Exception;
    public Post updatePost(Long id, Long userId, PostRequest request) throws Exception;
    public void deletePost(Long id, Long userId) throws Exception;
}
