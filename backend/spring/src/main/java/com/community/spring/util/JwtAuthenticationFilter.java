package com.community.spring.util;

import java.io.IOException;
import java.util.Collections;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        logger.debug("JwtAuthenticationFilter - Request URI: {}", requestURI);

        // 인증이 필요 없는 경로만 명시적으로 제외 (예: 로그인, 회원가입)
        if (requestURI.equals("/api/auth/login") || requestURI.equals("/api/auth/register")) {
            logger.debug("JwtAuthenticationFilter - Skipping authentication filter for login/register path");
            filterChain.doFilter(request, response);
            return;
        }

        String token = getTokenFromRequest(request);

        if (token != null) {
            logger.debug("JwtAuthenticationFilter - JWT Token found: {}", token);
            if (jwtUtil.validateToken(token)) {
                String username = jwtUtil.getUsernameFromToken(token);
                Long userId = jwtUtil.getUserIdFromToken(token);
                logger.debug("JwtAuthenticationFilter - Token valid for user: {}, userId: {}", username, userId);

                CustomUserPrincipal userPrincipal = new CustomUserPrincipal(username, userId);
                UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userPrincipal, null, Collections.emptyList());

                SecurityContextHolder.getContext().setAuthentication(authentication);
                logger.debug("JwtAuthenticationFilter - SecurityContextHolder updated with authentication");
            } else {
                logger.warn("JwtAuthenticationFilter - Invalid JWT token");
            }
        } else {
            logger.debug("JwtAuthenticationFilter - No JWT token found in request");
        }

        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    public static class CustomUserPrincipal {
        private final String username;
        private final Long userId;

        public CustomUserPrincipal(String username, Long userId) {
            this.username = username;
            this.userId = userId;
        }

        public String getUsername() {
            return username;
        }

        public Long getUserId() {
            return userId;
        }

        @Override
        public String toString() {
            return username;
        }
    }
}
