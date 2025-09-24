package com.community.spring.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.community.spring.domain.Post;

@Mapper
public interface PostMapper {
    public void insertPost(Post post) throws Exception;
    public List<Post> findAllPosts() throws Exception;
    public Post findById(@Param("id") Long id) throws Exception;
    public List<Post> findByUserId(@Param("userId") Long userId) throws Exception;
    public void updatePost(Post post) throws Exception;
    public void deletePost(@Param("id") Long id) throws Exception;
    public void incrementViewCount(@Param("id") Long id) throws Exception;
}
