package com.community.spring.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.community.spring.domain.Post;
import com.community.spring.dto.PostRequest;
import com.community.spring.mapper.PostMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PostServiceImpl implements PostService {
    
    private final PostMapper postMapper;
    
    @Override
    public Post createPost(Long userId, PostRequest request) throws Exception {
        Post post = Post.builder()
                .userId(userId)
                .title(request.getTitle())
                .content(request.getContent())
                .imageUrl(request.getImageUrl())
                .viewCount(0)
                .isDeleted(false)
                .build();
        
        postMapper.insertPost(post);
        return postMapper.findById(post.getId());  // 생성된 게시글 정보 반환
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageInfo<Post> getPosts(int pageNum, int pageSize) throws Exception {
        PageHelper.startPage(pageNum, pageSize);
        return new PageInfo<>(postMapper.findAllPosts());
    }
    
    @Override
    @Transactional
    public Post getPostById(Long id) throws Exception {
        // 조회수 증가를 별도 트랜잭션으로 처리
        postMapper.incrementViewCount(id);
        return postMapper.findById(id);
    }
    
    @Override
    public Post updatePost(Long id, Long userId, PostRequest request) throws Exception {
        Post existingPost = postMapper.findById(id);
        if (existingPost == null || existingPost.isDeleted()) {
            throw new RuntimeException("게시글을 찾을 수 없습니다.");
        }
        
        if (!existingPost.getUserId().equals(userId)) {
            throw new RuntimeException("게시글 수정 권한이 없습니다.");
        }
        
        Post post = Post.builder()
                .id(id)
                .title(request.getTitle())
                .content(request.getContent())
                .imageUrl(request.getImageUrl())
                .build();
        
        postMapper.updatePost(post);
        return postMapper.findById(id);
    }
    
    @Override
    public void deletePost(Long id, Long userId) throws Exception{
        Post existingPost = postMapper.findById(id);
        if (existingPost == null || existingPost.isDeleted()) {
            throw new RuntimeException("게시글을 찾을 수 없습니다.");
        }
        
        if (!existingPost.getUserId().equals(userId)) {
            throw new RuntimeException("게시글 삭제 권한이 없습니다.");
        }
        
        postMapper.deletePost(id);
    }
}