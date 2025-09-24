package com.community.spring.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.community.spring.dto.ImageUploadResponse;
import com.community.spring.service.FirebaseService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class UploadController {
    
    private final FirebaseService firebaseService;
    
    @PostMapping("/image")
    public ResponseEntity<Map<String, Object>> uploadImage(
            @RequestParam(name = "file") MultipartFile file,
            @RequestParam(name = "folder", defaultValue = "images") String folder) {
        
        try {
            String imageUrl = firebaseService.uploadImage(file, folder);
            
            ImageUploadResponse uploadResponse = new ImageUploadResponse();
            uploadResponse.setImageUrl(imageUrl);
            uploadResponse.setFileName(firebaseService.generateFileName(file.getOriginalFilename()));
            uploadResponse.setFileSize(file.getSize());
            uploadResponse.setContentType(file.getContentType());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "이미지 업로드 완료");
            response.put("data", uploadResponse);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}