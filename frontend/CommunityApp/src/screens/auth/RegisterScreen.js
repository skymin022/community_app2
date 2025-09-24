import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import Toast from 'react-native-toast-message';

import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { register } = useAuth();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = '사용자명을 입력해주세요';
    } else if (formData.username.length < 3) {
      newErrors.username = '사용자명은 3글자 이상이어야 합니다';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요';
    }
    
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6글자 이상이어야 합니다';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }
    
    if (!formData.nickname.trim()) {
      newErrors.nickname = '닉네임을 입력해주세요';
    } else if (formData.nickname.length < 2) {
      newErrors.nickname = '닉네임은 2글자 이상이어야 합니다';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      const result = await register(registerData);
      
      if (result.success) {
        Toast.show({
          type: 'success',
          text1: '회원가입 성공',
          text2: '로그인 화면으로 이동합니다',
        });
        navigation.navigate('Login');
      } else {
        Alert.alert('회원가입 실패', result.message);
      }
    } catch (error) {
      Alert.alert('오류', '회원가입 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.title}>회원가입</Text>
            <Text style={styles.subtitle}>새 계정을 만들어보세요</Text>
            
            <View style={styles.form}>
              <Input
                label="사용자명"
                value={formData.username}
                onChangeText={(value) => handleInputChange('username', value)}
                error={errors.username}
                placeholder="사용자명 (3글자 이상)"
                autoCapitalize="none"
              />
              
              <Input
                label="이메일"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                error={errors.email}
                placeholder="이메일 주소"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <Input
                label="비밀번호"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                error={errors.password}
                placeholder="비밀번호 (6글자 이상)"
                secureTextEntry
              />
              
              <Input
                label="비밀번호 확인"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                error={errors.confirmPassword}
                placeholder="비밀번호를 다시 입력하세요"
                secureTextEntry
              />
              
              <Input
                label="닉네임"
                value={formData.nickname}
                onChangeText={(value) => handleInputChange('nickname', value)}
                error={errors.nickname}
                placeholder="닉네임 (2글자 이상)"
              />
              
              <Button
                title="회원가입"
                onPress={handleRegister}
                loading={loading}
                style={styles.registerButton}
              />
              
              <Button
                title="이미 계정이 있나요? 로그인"
                onPress={() => navigation.navigate('Login')}
                variant="secondary"
                style={styles.loginButton}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  registerButton: {
    marginTop: 16,
  },
  loginButton: {
    marginTop: 12,
  },
});

export default RegisterScreen;