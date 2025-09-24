import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  RefreshControl,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

import { initializeApp, getApps } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import ApiService from '../../services/api';
import Loading from '../../components/common/Loading';
import CommentList from '../../components/comment/CommentList';
import CommentInput from '../../components/comment/CommentInput';
import { useAuth } from '../../context/AuthContext';

// Firebase config (본인 Firebase 프로젝트 설정에 맞게 수정)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Firebase 앱 초기화
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
// Storage 인스턴스 얻기
const storage = getStorage(app);

const PostDetailScreen = ({ route, navigation }) => {
  // params 안전 처리
  const postId = route?.params?.postId;

  // Profile에서 진입했는지 여부를 params로 전달받음
  const fromProfile = route?.params?.fromProfile;

  const [post, setPost] = useState(null);
  const [imageUri, setImageUri] = useState(null); // Firebase https URL
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { user, isAuthenticated } = useAuth();


  const loadPostData = useCallback(async () => {
    try {
      const [postResponse, commentsResponse] = await Promise.all([
        ApiService.getPost(postId),
        ApiService.getComments(postId),
      ]);

      setPost(postResponse);
      setComments(commentsResponse || []);

      if (postResponse?.imageUrl) {
        try {
          const imageRef = ref(storage, postResponse.imageUrl); // 상대 경로(e.g. 'images/파일명.jpg')
          const url = await getDownloadURL(imageRef); // 절대 https URL 얻기
          console.log('imageUrl :', postResponse.imageUrl);
          setImageUri(url);
        } catch (err) {
          console.error("Failed to get download URL:", err);
          setImageUri(null);
        }
      } else {
        setImageUri(null);
      }
    } catch (error) {
      Alert.alert('오류', '게시글을 불러오는데 실패했습니다.');
      navigation.goBack();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [postId, navigation]);

  useEffect(() => {
    loadPostData();
  }, [loadPostData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadPostData();
  };

  const isAuthor = user && user.id === post?.userId;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };




  // 모든 Hook은 return문보다 위에 위치해야 함
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 16 }}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, fromProfile]);

  if (loading) return <Loading />;

  if (!postId) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>잘못된 접근입니다.</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>게시글을 찾을 수 없습니다</Text>
      </View>
    );
  }

    const handleCommentSubmit = async (content, parentId = null) => {
    try {
      const commentData = { content, parentId };
      await ApiService.createComment(postId, commentData);

      // 댓글 목록 새로고침
      const updatedComments = await ApiService.getComments(postId);
      setComments(updatedComments || []);

      Toast.show({
        type: 'success',
        text1: '댓글이 작성되었습니다',
      });
    } catch (error) {
      Alert.alert('오류', '댓글 작성에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{post.userNickname}</Text>
            <Text style={styles.postDate}>{formatDate(post.createdAt)}</Text>
          </View>
          <View style={styles.postActions}>
            <View style={styles.viewCount}>
              <Icon name="visibility" size={16} color="#666" />
              <Text style={styles.viewText}>{post.viewCount}</Text>
            </View>
            {isAuthor && (
              <View style={styles.authorActions}>
                <TouchableOpacity onPress={() => navigation.navigate('EditPost', { post })} style={styles.actionButton}>
                  <Icon name="edit" size={20} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  Alert.alert(
                    '게시글 삭제',
                    '정말로 이 게시글을 삭제하시겠습니까?',
                    [
                      { text: '취소', style: 'cancel' },
                      {
                        text: '삭제',
                        style: 'destructive',
                        onPress: async () => {
                          try {
                            await ApiService.deletePost(postId);
                            Toast.show({ type: 'success', text1: '게시글이 삭제되었습니다' });
                            navigation.goBack();
                          } catch {
                            Alert.alert('오류', '게시글 삭제에 실패했습니다.');
                          }
                        }
                      }
                    ]
                  )
                }} style={styles.actionButton}>
                  <Icon name="delete" size={20} color="#f44336" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{post.title}</Text>
          {imageUri && <Image source={{ uri: imageUri }} style={styles.postImage} resizeMode="contain" />}
          <Text style={styles.postContent}>{post.content}</Text>
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.commentsHeader}>댓글 {comments.length}개</Text>
          <CommentList comments={comments} onCommentUpdate={() => loadPostData()} currentUserId={user?.id} />
        </View>
      </ScrollView>

      {isAuthenticated ? (
        <CommentInput onSubmit={handleCommentSubmit} />
      ) : (
        <View style={styles.loginPrompt}>
          <Text style={styles.loginPromptText}>댓글을 작성하려면 로그인해주세요</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollView: { flex: 1 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: '#666' },
  header: {
    backgroundColor: 'white',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  authorInfo: { flex: 1 },
  authorName: { fontSize: 16, fontWeight: '600', color: '#333' },
  postDate: { fontSize: 12, color: '#666', marginTop: 4 },
  postActions: { flexDirection: 'row', alignItems: 'center' },
  viewCount: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  viewText: { fontSize: 12, color: '#666', marginLeft: 4 },
  authorActions: { flexDirection: 'row' },
  actionButton: { padding: 4, marginLeft: 8 },
  content: { backgroundColor: 'white', padding: 16, marginBottom: 8 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16, lineHeight: 28 },
  postImage: { width: '100%', height: 200, borderRadius: 8, marginBottom: 16, backgroundColor: '#f0f0f0' },
  postContent: { fontSize: 16, color: '#333', lineHeight: 24 },
  commentsSection: { backgroundColor: 'white', padding: 16 },
  commentsHeader: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 16 },
  loginPrompt: { backgroundColor: 'white', padding: 16, borderTopWidth: 1, borderTopColor: '#eee', alignItems: 'center' },
  loginPromptText: { fontSize: 14, color: '#666' },
});

export default PostDetailScreen;
