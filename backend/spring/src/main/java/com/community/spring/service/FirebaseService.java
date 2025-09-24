package com.community.spring.service;

import org.springframework.web.multipart.MultipartFile;

import org.apache.ibatis.annotations.Param;

public interface FirebaseService {
    
    // 이미지 업로드
    String uploadImage(MultipartFile file, @Param("folder") String folder);
    
    // 이미지 삭제
    void deleteImage(@Param("fileName") String fileName);
    
    // 이미지 URL 생성
    String getImageUrl(@Param("fileName") String fileName);
    
    // 파일명 생성 (중복 방지)
    String generateFileName(@Param("originalFileName") String originalFileName);
}