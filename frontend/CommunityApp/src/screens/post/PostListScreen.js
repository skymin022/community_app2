import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

import ApiService from '../../services/api';
import Loading from '../../components/common/Loading';
import { useAuth } from '../../context/AuthContext';

const PostItem = ({ post, onPress }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return '방금 전';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`;
    
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <TouchableOpacity style={styles.postItem} onPress={onPress}>
      <View style={styles.postHeader}>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{post.userNickname}</Text>
          <Text style={styles.postDate}>{formatDate(post.createdAt)}</Text>
        </View>
        <View style={styles.postStats}>
          <View style={styles.statItem}>
            <Icon name="visibility" size={14} color="#666" />
            <Text style={styles.statText}>{post.viewCount}</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.postTitle} numberOfLines={2}>{post.title}</Text>
      <Text style={styles.postContent} numberOfLines={3}>{post.content}</Text>
      
      {post.imageUrl && (
        <View style={styles.imageIndicator}>
          <Icon name="image" size={16} color="#666" />
          <Text style={styles.imageText}>이미지 첨부</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const PostListScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const { isAuthenticated } = useAuth();

    useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // 화면에 포커스될 때 새로고침
      refreshPosts();
    });
    
    return unsubscribe;
  }, [navigation, refreshPosts]);

  const loadPosts = useCallback(async (pageNum = 1, refresh = false) => {
    try {
      if (pageNum === 1 && !refresh) setLoading(true);
      
      const response = await ApiService.getPosts(pageNum, 10);
      
      if (refresh || pageNum === 1) {
        setPosts(response.list || []);
      } else {
        setPosts(prev => [...prev, ...(response.list || [])]);
      }
      
      setHasMore(response.hasNextPage || false);
      setPage(pageNum);
      
    } catch (error) {
      Alert.alert('오류', '게시글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  const refreshPosts = useCallback(() => {
    setRefreshing(true);
    loadPosts(1, true);
  }, [loadPosts]);

  const loadMorePosts = () => {
    if (hasMore && !loadingMore) {
      setLoadingMore(true);
      loadPosts(page + 1);
    }
  };

  const handlePostPress = (post) => {
    navigation.navigate('PostDetail', { postId: post.id, post });
  };

  const handleCreatePost = () => {
    if (!isAuthenticated) {
      Alert.alert('로그인 필요', '게시글을 작성하려면 로그인해주세요.');
      return;
    }
    navigation.navigate('CreatePost');
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <Loading />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="article" size={64} color="#ccc" />
      <Text style={styles.emptyText}>아직 게시글이 없습니다</Text>
      <Text style={styles.emptySubtext}>첫 번째 게시글을 작성해보세요!</Text>
    </View>
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PostItem post={item} onPress={() => handlePostPress(item)} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshPosts} />
        }
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
      
      {isAuthenticated && (
        <TouchableOpacity style={styles.fab} onPress={handleCreatePost}>
          <Icon name="add" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  postItem: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  postDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  postContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  imageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  imageText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  loadingFooter: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});

export default PostListScreen;