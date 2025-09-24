package com.community.spring.service;

import com.community.spring.domain.User;
import com.community.spring.dto.LoginRequest;
import com.community.spring.dto.RegisterRequest;

public interface UserService {
    public User register(RegisterRequest request) throws Exception;
    public String login(LoginRequest request) throws Exception;
    public User getUserById(Long id) throws Exception;
    public User getUserByUsername(String username) throws Exception;
    public void updateUser(Long id, User user) throws Exception;
    public void deleteUser(Long id) throws Exception;
}
