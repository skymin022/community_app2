package com.community.spring.mapper;



import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.community.spring.domain.User;

@Mapper
public interface UserMapper {
    public void insertUser(User user) throws Exception;
    public User findByUsername(@Param("username") String username) throws Exception;
    public User findByEmail(@Param("email") String email) throws Exception;
    public User findById(@Param("id") Long id) throws Exception;
    public void updateUser(User user) throws Exception;
    public void deleteUser(@Param("id") Long id) throws Exception;
}


