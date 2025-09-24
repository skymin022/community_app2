package com.community.spring.domain;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 댓글 정보 도메인 클래스
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {

    /** 댓글 ID (PK) */
    private Long id;

    /** 게시글 ID (FK) */
    private Long postId;

    /** 작성자 ID (FK) */
    private Long userId;

    /** 댓글 내용 */
    private String content;

    /** 부모 댓글 ID (대댓글용) */
    private Long parentId;

    /** 생성일시 */
    private LocalDateTime createdAt;

    /** 수정일시 */
    private LocalDateTime updatedAt;

    /** 삭제 여부 */
    private boolean isDeleted;

    // 조인용 필드
    private String userNickname;
    private String userProfileImageUrl;
}
