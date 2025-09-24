package com.community.spring.service;

import org.springframework.web.multipart.MultipartFile;

public interface FirebaseService {
    
    // 이미지 업로드
    String uploadImage(MultipartFile file, String folder);
    
    // 이미지 삭제
    void deleteImage(String fileName);
    
    // 이미지 URL 생성
    String getImageUrl(String fileName);
    
    // 파일명 생성 (중복 방지)
    String generateFileName(String originalFileName);
}