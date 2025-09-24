-- Active: 1758610060647@@127.0.0.1@3306@communityapp
-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS community_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE community_app;

-- 사용자 테이블
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '사용자명',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT '이메일',
    password VARCHAR(255) NOT NULL COMMENT '암호화된 비밀번호',
    nickname VARCHAR(50) NOT NULL COMMENT '닉네임',
    profile_image_url VARCHAR(500) COMMENT '프로필 이미지 URL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE COMMENT '활성 상태'
) COMMENT '사용자 정보';

-- 게시글 테이블
CREATE TABLE posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '작성자 ID',
    title VARCHAR(200) NOT NULL COMMENT '제목',
    content TEXT NOT NULL COMMENT '내용',
    image_url VARCHAR(500) COMMENT '첨부 이미지 URL',
    view_count INT DEFAULT 0 COMMENT '조회수',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE COMMENT '삭제 여부',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) COMMENT '게시글';

-- 댓글 테이블
CREATE TABLE comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id BIGINT NOT NULL COMMENT '게시글 ID',
    user_id BIGINT NOT NULL COMMENT '작성자 ID',
    content TEXT NOT NULL COMMENT '댓글 내용',
    parent_id BIGINT COMMENT '부모 댓글 ID (대댓글용)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE COMMENT '삭제 여부',
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
) COMMENT '댓글';

-- 인덱스 생성
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);

-- 초기 테스트 데이터
INSERT INTO users (username, email, password, nickname) VALUES 
('testuser1', 'test1@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG13AuenBTLfmjhKy6', '테스트유저1'),
('testuser2', 'test2@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG13AuenBTLfmjhKy6', '테스트유저2');

INSERT INTO posts (user_id, title, content) VALUES 
(1, '첫 번째 게시글', '안녕하세요! 첫 번째 게시글입니다.'),
(2, '두 번째 게시글', '두 번째 게시글 내용입니다.');

INSERT INTO comments (post_id, user_id, content) VALUES 
(1, 2, '첫 번째 댓글입니다.'),
(1, 1, '답글입니다.');