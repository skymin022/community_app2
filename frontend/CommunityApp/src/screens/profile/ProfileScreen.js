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
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';

import { useAuth } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '../../services/api';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { uploadImageToFirebase } from '../../utils/firebase';


const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false); // 프로필 이미지 업로드용
  const [profileImage, setProfileImage] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true); // 게시글/댓글 수 로딩
  const [postCount, setPostCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [statsError, setStatsError] = useState(null);
  const [localUser, setLocalUser] = useState(null); // AsyncStorage에서 불러온 user
  const [profileLoading, setProfileLoading] = useState(true); // 프로필 정보 불러오는 중 여부

  // user 프로필 이미지가 변경되면 상태 업데이트
  useEffect(() => {
    if (user?.profileImageUrl) {
      setProfileImage(user.profileImageUrl);
    } else if (localUser?.profileImageUrl) {
      setProfileImage(localUser.profileImageUrl);
    }
  }, [user, localUser]);

  // 최초 렌더링 시 accessToken이 있고 user가 없으면 getCurrentUser로 정보 조회
  useEffect(() => {
    let mounted = true;
    if (user) {
      setProfileLoading(false);
      setLocalUser(null); // user가 있으면 localUser는 사용하지 않음
      return;
    }
    (async () => {
      setProfileLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        try {
          const currentUser = await ApiService.getCurrentUser();
          if (mounted) {
            setLocalUser(currentUser);
            await AsyncStorage.setItem('user', JSON.stringify(currentUser));
          }
        } catch (e) {
          if (mounted) setLocalUser(null);
        }
      } else {
        // accessToken도 없으면 기존 로직대로 user 정보만 시도
        const data = await AsyncStorage.getItem('user');
        if (data && mounted) setLocalUser(JSON.parse(data));
      }
      if (mounted) setProfileLoading(false);
    })();
    return () => { mounted = false; };
  }, [user]);

  // 게시글/댓글 수 불러오기
  useEffect(() => {
    // user가 있으면 user만 사용, 없으면 localUser 사용
    const targetUser = user || localUser;
    console.log('[ProfileScreen] targetUser:', targetUser);
    if (!targetUser?.id) {
      setStatsLoading(false);
      return;
    }
    setStatsLoading(true);
    setStatsError(null);
    Promise.all([
      ApiService.getUserPostCount(targetUser.id).then(res => {
        console.log('[ProfileScreen] getUserPostCount:', res);
        setPostCount(res.count);
      }).catch((e) => {
        console.log('[ProfileScreen] getUserPostCount error:', e);
        setPostCount(0);
      }),
      ApiService.getUserCommentCount(targetUser.id).then(res => {
        console.log('[ProfileScreen] getUserCommentCount:', res);
        setCommentCount(res.count);
      }).catch((e) => {
        console.log('[ProfileScreen] getUserCommentCount error:', e);
        setCommentCount(0);
      }),
    ]).catch((err) => {
      setStatsError('정보를 불러오지 못했습니다.');
      console.log('[ProfileScreen] stats error:', err);
    }).finally(() => setStatsLoading(false));
  }, [user, localUser]);

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

          // 프로필 이미지 업데이트 API 호출 예:
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


  const targetUser = user || localUser;
  if (profileLoading) {
    return <Loading />;
  }
  if (!targetUser) {
    // user가 null이고 로딩도 끝났으면 로그인 필요 안내
    return (
      <SafeAreaView style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <Text>로그인이 필요합니다.</Text>
      </SafeAreaView>
    );
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
            {loading ? (
              <View style={[styles.profileImage, styles.loadingOverlay]}>
                <Loading size="small" />
              </View>
            ) : profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.defaultProfileImage}>
                <Icon name="person" size={48} color="#666" />
              </View>
            )}
            
            <View style={styles.cameraIcon}>
              <Icon name="camera-alt" size={16} color="white" />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.nickname}>{targetUser.nickname}</Text>
          <Text style={styles.username}>@{targetUser.username}</Text>
          <Text style={styles.email}>{targetUser.email}</Text>
        </View>
        
        {/* Profile Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            {statsLoading ? (
              <Loading size="small" />
            ) : (
              <Text style={styles.statNumber}>{postCount}</Text>
            )}
            <Text style={styles.statLabel}>게시글</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            {statsLoading ? (
              <Loading size="small" />
            ) : (
              <Text style={styles.statNumber}>{commentCount}</Text>
            )}
            <Text style={styles.statLabel}>댓글</Text>
          </View>
        </View>
        {statsError && (
          <View style={{alignItems:'center', marginBottom:8}}>
            <Text style={{color:'red', fontSize:12}}>{statsError}</Text>
          </View>
        )}
        
        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Profile', { screen: 'MyPost' })}>
            <Icon name="article" size={24} color="#333" />
            <Text style={styles.menuText}>내 게시글</Text>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('MyComment')}>
            <Icon name="comment" size={24} color="#333" />
            <Text style={styles.menuText}>내 댓글</Text>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Setting')}>
            <Icon name="settings" size={24} color="#333" />
            <Text style={styles.menuText}>설정</Text>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Help')}>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
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
