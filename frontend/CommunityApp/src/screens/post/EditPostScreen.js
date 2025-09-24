import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

import ApiService from '../../services/api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { uploadImageToFirebase } from '../../utils/firebase';

const EditPostScreen = ({ route, navigation }) => {
  const { post } = route.params;
  
  const [formData, setFormData] = useState({
    title: post.title || '',
    content: post.content || '',
    imageUrl: post.imageUrl || '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageChanged, setImageChanged] = useState(false);

  useEffect(() => {
    // 네비게이션 헤더 설정
    navigation.setOptions({
      title: '게시글 수정',
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={styles.headerButton}
        >
          <Icon 
            name="check" 
            size={24} 
            color={loading ? '#ccc' : '#2196F3'} 
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, loading]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요';
    } else if (formData.title.length > 200) {
      newErrors.title = '제목은 200자 이하로 입력해주세요';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = '내용을 입력해주세요';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1000,
      maxHeight: 1000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel || response.error) return;
      
      if (response.assets && response.assets[0]) {
        setSelectedImage(response.assets[0]);
        setImageChanged(true);
      }
    });
  };

  const removeImage = () => {
    setSelectedImage(null);
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    setImageChanged(true);
  };

  const uploadImage = async () => {
    if (!selectedImage) return formData.imageUrl;
    
    try {
      const imageUrl = await uploadImageToFirebase(selectedImage);
      return imageUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error('이미지 업로드에 실패했습니다');
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      let imageUrl = formData.imageUrl;
      
      // 이미지가 변경된 경우에만 업로드
      if (imageChanged) {
        imageUrl = await uploadImage();
      }
      
      const updatedData = {
        ...formData,
        imageUrl,
      };
      
      const response = await ApiService.updatePost(post.id, updatedData);
      
      if (response.success) {
        Toast.show({
          type: 'success',
          text1: '게시글이 수정되었습니다',
        });
        
        // 수정된 게시글 데이터를 이전 화면으로 전달
        navigation.goBack();
      } else {
        Alert.alert('오류', response.message || '게시글 수정에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', error.message || '게시글 수정 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // 변경사항이 있는지 확인
    const hasChanges = 
      formData.title !== post.title ||
      formData.content !== post.content ||
      imageChanged;

    if (hasChanges) {
      Alert.alert(
        '수정 취소',
        '변경사항이 저장되지 않습니다. 정말로 취소하시겠습니까?',
        [
          { text: '계속 수정', style: 'cancel' },
          { 
            text: '취소', 
            style: 'destructive',
            onPress: () => navigation.goBack()
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const renderCurrentImage = () => {
    if (selectedImage) {
      return (
        <View style={styles.selectedImageContainer}>
          <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
          <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
            <Icon name="close" size={20} color="white" />
          </TouchableOpacity>
        </View>
      );
    }
    
    if (formData.imageUrl && !imageChanged) {
      return (
        <View style={styles.selectedImageContainer}>
          <Image source={{ uri: formData.imageUrl }} style={styles.selectedImage} />
          <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
            <Icon name="close" size={20} color="white" />
          </TouchableOpacity>
        </View>
      );
    }
    
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Input
              label="제목"
              value={formData.title}
              onChangeText={(value) => handleInputChange('title', value)}
              error={errors.title}
              placeholder="게시글 제목을 입력하세요"
            />
            
            <Input
              label="내용"
              value={formData.content}
              onChangeText={(value) => handleInputChange('content', value)}
              error={errors.content}
              placeholder="게시글 내용을 입력하세요"
              multiline
              style={styles.contentInput}
            />
            
            {/* Image Section */}
            <View style={styles.imageSection}>
              <Text style={styles.imageLabel}>이미지 첨부</Text>
              
              {renderCurrentImage()}
              
              {(!selectedImage && (!formData.imageUrl || imageChanged)) && (
                <TouchableOpacity style={styles.imageSelector} onPress={selectImage}>
                  <Icon name="add-photo-alternate" size={32} color="#666" />
                  <Text style={styles.imageSelectorText}>이미지 선택</Text>
                </TouchableOpacity>
              )}
              
              {(selectedImage || (formData.imageUrl && !imageChanged)) && (
                <TouchableOpacity style={styles.changeImageButton} onPress={selectImage}>
                  <Icon name="edit" size={16} color="#2196F3" />
                  <Text style={styles.changeImageText}>이미지 변경</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.buttonContainer}>
              <Button
                title="수정 완료"
                onPress={handleSubmit}
                loading={loading}
                style={styles.submitButton}
              />
              
              <Button
                title="취소"
                onPress={handleCancel}
                variant="secondary"
                style={styles.cancelButton}
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
    padding: 16,
  },
  headerButton: {
    marginRight: 16,
  },
  contentInput: {
    marginBottom: 24,
  },
  imageSection: {
    marginBottom: 24,
  },
  imageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  selectedImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSelector: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageSelectorText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  changeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  changeImageText: {
    fontSize: 14,
    color: '#2196F3',
    marginLeft: 6,
  },
  buttonContainer: {
    marginTop: 16,
  },
  submitButton: {
    marginBottom: 12,
  },
  cancelButton: {
    marginBottom: 12,
  },
});

export default EditPostScreen;