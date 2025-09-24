package com.community.spring.domain;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 게시글 정보 도메인 클래스
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    /** 게시글 ID (PK) */
    private Long id;

    /** 작성자 ID (FK) */
    private Long userId;

    /** 제목 */
    @NotBlank(message = "제목은 필수입니다")
    @Size(max = 200, message = "제목은 200자를 초과할 수 없습니다")
    private String title;

    /** 내용 */
    @NotBlank(message = "내용은 필수입니다")
    private String content;

    /** 첨부 이미지 URL */
    private String imageUrl;

    /** 조회수 */
    private int viewCount;

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
