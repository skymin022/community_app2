package com.community.spring.dto;

import lombok.Data;

@Data
public class ImageUploadResponse {
    private String imageUrl;
    private String fileName;
    private long fileSize;
    private String contentType;
    
}