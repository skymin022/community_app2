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

    // Request interceptor - 토큰 자동 추가
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - 에러 처리
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('accessToken');
          await AsyncStorage.removeItem('user');
          // 로그인 화면으로 이동하는 로직 추가 가능
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth APIs
  async register(userData) {
    const response = await this.client.post('/auth/register', userData);
    return response.data;
  }

  async login(credentials) {
    const response = await this.client.post('/auth/login', credentials);
    if (response.data.success && response.data.token) {
      await AsyncStorage.setItem('accessToken', response.data.token);
    }
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  async logout() {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('user');
  }

  // Post APIs
  async getPosts(page = 1, size = 10) {
    const response = await this.client.get(`/posts?page=${page}&size=${size}`);
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

  // Comment APIs
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