import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ApiService from '../../services/api';
import Loading from '../../components/common/Loading';
import { useAuth } from '../../context/AuthContext';

const MyPostScreen = ({ navigation }) => {
  // 뒤로가기(헤더/제스처/하드웨어) 시 항상 ProfileMain(프로필 메인)으로 이동
  useLayoutEffect(() => {
    const goProfileMain = () => navigation.navigate('ProfileMain');
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={goProfileMain} style={{ marginLeft: 16 }}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      ),
    });
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      goProfileMain();
    });
    return unsubscribe;
  }, [navigation]);
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      setLoading(true);
      try {
        const res = await ApiService.getUserPosts(user.id);
        setPosts(res || []);
      } catch (e) {
        Alert.alert('오류', '내 게시글을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (loading) return <Loading />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 게시글</Text>
      <FlatList
        data={posts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('PostDetail', { postId: item.id, fromProfile: true })}
          >
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemContent}>{item.content}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>작성한 게시글이 없습니다.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  item: { marginBottom: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8 },
  itemTitle: { fontSize: 16, fontWeight: 'bold' },
  itemContent: { fontSize: 14, color: '#666', marginTop: 4 },
  empty: { textAlign: 'center', color: '#999', marginTop: 32 },
});

export default MyPostScreen;