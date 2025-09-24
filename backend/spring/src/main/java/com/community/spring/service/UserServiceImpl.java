package com.community.spring.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.community.spring.domain.User;
import com.community.spring.dto.LoginRequest;
import com.community.spring.dto.RegisterRequest;
import com.community.spring.mapper.UserMapper;
import com.community.spring.util.JwtUtil;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {
    
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    @Override
    public User register(RegisterRequest request) throws Exception{
        // 중복 검사
        if (userMapper.findByUsername(request.getUsername()) != null) {
            throw new RuntimeException("이미 존재하는 사용자명입니다.");
        }
        if (userMapper.findByEmail(request.getEmail()) != null) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }
        
        // 사용자 생성
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .isActive(true)
                .build();
        
        userMapper.insertUser(user);
        return user;
    }
    
    @Override
    public String login(LoginRequest request) throws Exception {
        User user = userMapper.findByUsername(request.getUsername());
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            // throw new RuntimeException("로그인 실패: " + request.getUsername() + ", " + request.getPassword());
            throw new RuntimeException("잘못된 사용자명 또는 비밀번호입니다.");
        }
        
        if (!user.isActive()) {
            throw new RuntimeException("비활성 사용자입니다.");
        }
        
        return jwtUtil.generateToken(user.getId(), user.getUsername());
    }
    
    @Override
    @Transactional(readOnly = true)
    public User getUserById(Long id) throws Exception {
        return userMapper.findById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public User getUserByUsername(String username) throws Exception {
        return userMapper.findByUsername(username);
    }
    
    @Override
    public void updateUser(Long id, User user) throws Exception {
        user.setId(id);
        userMapper.updateUser(user);
    }
    
    @Override
    public void deleteUser(Long id) throws Exception {
        userMapper.deleteUser(id);
    }

    @Override
    public long countPostsByUserId(Long userId) {
        return userMapper.countPostsByUserId(userId);
    }

    @Override
    public long countCommentsByUserId(Long userId) {
        return userMapper.countCommentsByUserId(userId);
    }

    @Override
    public void updateProfileImage(String username, String profileImageUrl) {
        userMapper.updateProfileImage(username, profileImageUrl);
    }

    @Override
    public java.util.List<com.community.spring.domain.Post> findPostsByUserId(Long userId) {
        return userMapper.findPostsByUserId(userId);
    }

    @Override
    public java.util.List<com.community.spring.domain.Comment> findCommentsByUserId(Long userId) {
        return userMapper.findCommentsByUserId(userId);
    }
}