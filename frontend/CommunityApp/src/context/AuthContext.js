import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  const checkAuthState = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const userData = await AsyncStorage.getItem('user');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
        
        // 토큰 유효성 검증
        try {
          const currentUser = await ApiService.getCurrentUser();
          setUser(currentUser);
          await AsyncStorage.setItem('user', JSON.stringify(currentUser));
        } catch (error) {
          await logout();
        }
      }
    } catch (error) {
      console.error('Auth state check error:', error);
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const login = async (credentials) => {
    try {
      const response = await ApiService.login(credentials);
      if (response.success) {
        const userData = await ApiService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || '로그인에 실패했습니다.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await ApiService.register(userData);
      return { success: response.success, message: response.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || '회원가입에 실패했습니다.' 
      };
    }
  };

  const logout = useCallback(async () => {
    try {
      await ApiService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};