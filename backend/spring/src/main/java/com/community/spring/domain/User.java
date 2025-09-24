package com.community.spring.domain;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 사용자 정보 도메인 클래스
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    /** 사용자 ID (PK) */
    private Long id;

    /** 사용자명 */
    @NotBlank(message = "사용자명은 필수 입력 항목입니다.")
    @Size(min = 4, max = 50, message = "사용자명은 4자 이상 50자 이하로 입력해주세요.")
    private String username;

    /** 이메일 */
    @NotBlank(message = "이메일은 필수 입력 항목입니다.")
    @Email(message = "유효한 이메일 형식이 아닙니다.")
    @Size(max = 100, message = "이메일은 최대 100자까지 입력 가능합니다.")
    private String email;

    /** 암호화된 비밀번호 */
    @NotBlank(message = "비밀번호는 필수 입력 항목입니다.")
    @Size(min = 8, message = "비밀번호는 8자 이상이어야 합니다.")
    @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$", message = "비밀번호는 영문, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.")
    private String password;

    /** 닉네임 */
    @NotBlank(message = "닉네임은 필수 입력 항목입니다.")
    @Size(min = 2, max = 50, message = "닉네임은 2자 이상 50자 이하로 입력해주세요.")
    private String nickname;

    /** 프로필 이미지 URL */
    @Size(max = 500, message = "프로필 이미지 URL은 최대 500자까지 가능합니다.")
    private String profileImageUrl;

    /** 생성일시 */
    private LocalDateTime createdAt;

    /** 수정일시 */
    private LocalDateTime updatedAt;

    /** 활성 상태 */
        @NotNull
    @Builder.Default
    private boolean isActive = true;
}
