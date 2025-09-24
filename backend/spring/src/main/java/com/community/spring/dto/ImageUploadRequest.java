package com.community.spring.dto;

public class ImageUploadRequest {
    private String folder; // 업로드할 폴더 (posts, profiles 등)
    
    public ImageUploadRequest() {
        this.folder = "images"; // 기본값
    }
    
    public ImageUploadRequest(String folder) {
        this.folder = folder;
    }
    
    public String getFolder() { return folder; }
    public void setFolder(String folder) { this.folder = folder; }
}