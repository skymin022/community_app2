import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://10.0.2.2:8080/api'; // Android Emulator용 localhost

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 요청 인터셉터: AsyncStorage에서 토큰 꺼내 Authorization 헤더에 자동 추가
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('accessToken');
        console.log('Interceptor token:', token); // 토큰 디버그 로그
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 응답 인터셉터: 401 Unauthorized 시 토큰 삭제 및 처리
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('accessToken');
          await AsyncStorage.removeItem('user');
          // 로그아웃 후 로그인 화면으로 이동 로직 추가 가능
        }
        return Promise.reject(error);
      }
    );
  }

  // 회원가입
  async register(userData) {
    const response = await this.client.post('/auth/register', userData);
    return response.data;
  }

  // 로그인
  async login(credentials) {
    try {
      const response = await this.client.post('/auth/login', credentials);
      console.log('login response:', response, response.data);
      if (response.data.success && response.data.token) {
        await AsyncStorage.setItem('accessToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.log('login error:', error, error.response);
      throw error;
    }
  }

  // 현재 로그인한 사용자 정보 조회
async getCurrentUser() {
  console.log('[ApiService] getCurrentUser 호출');
  const response = await this.client.get('/auth/me');
  return response.data;
}

  // 로그아웃
  async logout() {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('user');
  }

  // 게시글 관련 API
  async getPosts(page = 1, size = 10) {
    const response = await this.client.get(`/posts?page=${page}&size=${size}`);
    return response.data;
  }

  // 특정 사용자의 게시글 수 조회
  async getUserPostCount(userId) {
    const response = await this.client.get(`/users/${userId}/posts/count`);
    return response.data;
  }

  // 특정 사용자의 댓글 수 조회
  async getUserCommentCount(userId) {
    const response = await this.client.get(`/users/${userId}/comments/count`);
    return response.data;
  }

  // 특정 사용자의 게시글 목록 조회
  async getUserPosts(userId) {
    const response = await this.client.get(`/users/${userId}/posts`);
    return response.data;
  }

  // 특정 사용자의 댓글 목록 조회
  async getUserComments(userId) {
    const response = await this.client.get(`/users/${userId}/comments`);
    return response.data;
  }

  // 프로필 이미지 업데이트
  async updateProfileImage(profileImageUrl) {
    const response = await this.client.put('/users/profile-image', { profileImageUrl });
    return response.data;
  }

  async getPost(postId) {
    const response = await this.client.get(`/posts/${postId}`);
    return response.data;
  }

  async createPost(postData) {
    const response = await this.client.post('/posts', postData);
    return response.data;
  }

  async updatePost(postId, postData) {
    const response = await this.client.put(`/posts/${postId}`, postData);
    return response.data;
  }

  async deletePost(postId) {
    const response = await this.client.delete(`/posts/${postId}`);
    return response.data;
  }

  // 댓글 관련 API
  async getComments(postId) {
    const response = await this.client.get(`/posts/${postId}/comments`);
    return response.data;
  }

  async createComment(postId, commentData) {
    const response = await this.client.post(`/posts/${postId}/comments`, commentData);
    return response.data;
  }

  async updateComment(commentId, commentData) {
    const response = await this.client.put(`/comments/${commentId}`, commentData);
    return response.data;
  }

  async deleteComment(commentId) {
    const response = await this.client.delete(`/comments/${commentId}`);
    return response.data;
  }
}

export default new ApiService();
