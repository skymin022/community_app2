package com.community.spring.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import jakarta.annotation.PostConstruct;

// @Configuration
public class FirebaseConfig {
    
    @Value("${firebase.config-path}")
    private String configPath;
    
    @Value("${firebase.storage-bucket}")
    private String storageBucket;
    
    @PostConstruct
    public void initialize() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                ClassPathResource serviceAccount = new ClassPathResource(configPath);
                
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount.getInputStream()))
                        .setStorageBucket(storageBucket)
                        .build();
                
                FirebaseApp.initializeApp(options);
            }
        } catch (IOException e) {
            throw new RuntimeException("Firebase 초기화에 실패했습니다: " + e.getMessage());
        }
    }
}