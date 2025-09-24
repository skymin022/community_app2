package com.community.spring.service;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

@Service
public class FirebaseServiceImpl implements FirebaseService {
    
    @Value("${firebase.storage-bucket}")
    private String bucketName;
    
    private final Storage storage;
    
    public FirebaseServiceImpl() {
        this.storage = StorageOptions.getDefaultInstance().getService();
    }
    
    @Override
    public String uploadImage(MultipartFile file, String folder) {
        try {
            // 파일 유효성 검사
            if (file.isEmpty()) {
                throw new RuntimeException("업로드할 파일이 없습니다");
            }
            
            // 이미지 파일인지 확인
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("이미지 파일만 업로드 가능합니다");
            }
            
            // 파일 크기 확인 (10MB 제한)
            if (file.getSize() > 10 * 1024 * 1024) {
                throw new RuntimeException("파일 크기는 10MB를 초과할 수 없습니다");
            }
            
            // 고유한 파일명 생성
            String fileName = generateFileName(file.getOriginalFilename());
            String fullPath = folder + "/" + fileName;
            
            // Firebase Storage에 업로드
            BlobId blobId = BlobId.of(bucketName, fullPath);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                    .setContentType(contentType)
                    .build();
            
            storage.create(blobInfo, file.getBytes());
            
            // 공개 URL 생성
            return getImageUrl(fullPath);
            
        } catch (IOException e) {
            throw new RuntimeException("파일 업로드에 실패했습니다: " + e.getMessage());
        }
    }
    
    @Override
    public void deleteImage(String fileName) {
        try {
            BlobId blobId = BlobId.of(bucketName, fileName);
            boolean deleted = storage.delete(blobId);
            
            if (!deleted) {
                throw new RuntimeException("파일 삭제에 실패했습니다");
            }
        } catch (Exception e) {
            throw new RuntimeException("파일 삭제에 실패했습니다: " + e.getMessage());
        }
    }
    
    @Override
    public String getImageUrl(String fileName) {
        // Firebase Storage 공개 URL 형식
        return String.format("https://firebasestorage.googleapis.com/v0/b/%s/o/%s?alt=media", 
                            bucketName, 
                            fileName.replace("/", "%2F"));
    }
    
    @Override
    public String generateFileName(String originalFileName) {
        if (originalFileName == null || originalFileName.isEmpty()) {
            throw new RuntimeException("파일명이 없습니다");
        }
        
        // 확장자 추출
        String extension = "";
        int lastDotIndex = originalFileName.lastIndexOf(".");
        if (lastDotIndex > 0) {
            extension = originalFileName.substring(lastDotIndex);
        }
        
        // UUID와 타임스탬프를 조합하여 고유한 파일명 생성
        String uuid = UUID.randomUUID().toString();
        String timestamp = String.valueOf(System.currentTimeMillis());
        
        return timestamp + "_" + uuid + extension;
    }
}