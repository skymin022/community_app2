import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';

import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { uploadImageToFirebase } from '../../utils/firebase';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profileImageUrl);

  const handleImageSelect = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 500,
      maxHeight: 500,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel || response.error) return;
      
      if (response.assets && response.assets[0]) {
        setLoading(true);
        try {
          const imageUrl = await uploadImageToFirebase(response.assets[0]);
          setProfileImage(imageUrl);
          
          // 여기서 API 호출로 프로필 이미지 업데이트
          // await ApiService.updateProfile({ profileImageUrl: imageUrl });
          
          Toast.show({
            type: 'success',
            text1: '프로필 이미지가 업데이트되었습니다',
          });
        } catch (error) {
          Alert.alert('오류', '이미지 업로드에 실패했습니다.');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말로 로그아웃 하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '로그아웃', 
          style: 'destructive',
          onPress: () => {
            logout();
            Toast.show({
              type: 'info',
              text1: '로그아웃되었습니다',
            });
          }
        },
      ]
    );
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity 
            style={styles.profileImageContainer}
            onPress={handleImageSelect}
            disabled={loading}
          >
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.defaultProfileImage}>
                <Icon name="person" size={48} color="#666" />
              </View>
            )}
            
            <View style={styles.cameraIcon}>
              <Icon name="camera-alt" size={16} color="white" />
            </View>
            
            {loading && (
              <View style={styles.loadingOverlay}>
                <Loading size="small" />
              </View>
            )}
          </TouchableOpacity>
          
          <Text style={styles.nickname}>{user.nickname}</Text>
          <Text style={styles.username}>@{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
        
        {/* Profile Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>게시글</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>댓글</Text>
          </View>
        </View>
        
        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="article" size={24} color="#333" />
            <Text style={styles.menuText}>내 게시글</Text>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="comment" size={24} color="#333" />
            <Text style={styles.menuText}>내 댓글</Text>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="settings" size={24} color="#333" />
            <Text style={styles.menuText}>설정</Text>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="help" size={24} color="#333" />
            <Text style={styles.menuText}>도움말</Text>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>
        
        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button
            title="로그아웃"
            onPress={handleLogout}
            variant="secondary"
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 8,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
  },
  defaultProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nickname: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#999',
  },
  statsContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingVertical: 20,
    marginBottom: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  menuContainer: {
    backgroundColor: 'white',
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
  },
  logoutContainer: {
    padding: 16,
  },
  logoutButton: {
    borderColor: '#f44336',
  },
});

export default ProfileScreen;