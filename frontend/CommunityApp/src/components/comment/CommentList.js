import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

import ApiService from '../../services/api';
import CommentInput from './CommentInput';

const CommentItem = ({ comment, onCommentUpdate, currentUserId, level = 0 }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isAuthor = currentUserId === comment.userId;
  const isReply = level > 0;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return '방금 전';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`;
    
    return date.toLocaleDateString('ko-KR');
  };

  const handleReply = async (content) => {
    try {
      const commentData = { 
        content, 
        parentId: comment.parentId || comment.id 
      };
      await ApiService.createComment(comment.postId, commentData);
      
      setShowReplyInput(false);
      onCommentUpdate();
      
      Toast.show({
        type: 'success',
        text1: '답글이 작성되었습니다',
      });
    } catch (error) {
      Alert.alert('오류', '답글 작성에 실패했습니다.');
    }
  };

  const handleEdit = async (content) => {
    try {
      await ApiService.updateComment(comment.id, { content });
      
      setIsEditing(false);
      onCommentUpdate();
      
      Toast.show({
        type: 'success',
        text1: '댓글이 수정되었습니다',
      });
    } catch (error) {
      Alert.alert('오류', '댓글 수정에 실패했습니다.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      '댓글 삭제',
      '정말로 이 댓글을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '삭제', 
          style: 'destructive',
          onPress: async () => {
            try {
              await ApiService.deleteComment(comment.id);
              onCommentUpdate();
              
              Toast.show({
                type: 'success',
                text1: '댓글이 삭제되었습니다',
              });
            } catch (error) {
              Alert.alert('오류', '댓글 삭제에 실패했습니다.');
            }
          }
        },
      ]
    );
  };

  return (
    <View style={[
      styles.commentContainer,
      isReply && styles.replyContainer,
    ]}>
      <View style={styles.commentHeader}>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{comment.userNickname}</Text>
          <Text style={styles.commentDate}>{formatDate(comment.createdAt)}</Text>
        </View>
        
        {isAuthor && (
          <View style={styles.commentActions}>
### CommentList (계속)
```javascript
            <TouchableOpacity 
              onPress={() => setIsEditing(true)}
              style={styles.actionButton}
            >
              <Icon name="edit" size={16} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleDelete}
              style={styles.actionButton}
            >
              <Icon name="delete" size={16} color="#f44336" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {isEditing ? (
        <CommentInput
          initialValue={comment.content}
          onSubmit={handleEdit}
          onCancel={() => setIsEditing(false)}
          placeholder="댓글을 수정하세요"
          submitText="수정"
        />
      ) : (
        <>
          <Text style={styles.commentContent}>{comment.content}</Text>
          
          {!isReply && currentUserId && (
            <TouchableOpacity 
              onPress={() => setShowReplyInput(!showReplyInput)}
              style={styles.replyButton}
            >
              <Icon name="reply" size={14} color="#666" />
              <Text style={styles.replyButtonText}>답글</Text>
            </TouchableOpacity>
          )}
          
          {showReplyInput && (
            <CommentInput
              onSubmit={handleReply}
              onCancel={() => setShowReplyInput(false)}
              placeholder="답글을 작성하세요"
              submitText="답글 작성"
              style={styles.replyInput}
            />
          )}
        </>
      )}
    </View>
  );
};

const CommentList = ({ comments, onCommentUpdate, currentUserId }) => {
  // 댓글을 부모 댓글과 대댓글로 분류
  const organizeComments = (comments) => {
    const parentComments = comments.filter(comment => !comment.parentId);
    const childComments = comments.filter(comment => comment.parentId);
    
    return parentComments.map(parent => ({
      ...parent,
      replies: childComments.filter(child => child.parentId === parent.id),
    }));
  };

  const organizedComments = organizeComments(comments);

  if (comments.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>아직 댓글이 없습니다</Text>
        <Text style={styles.emptySubtext}>첫 번째 댓글을 작성해보세요!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {organizedComments.map((comment) => (
        <View key={comment.id}>
          <CommentItem
            comment={comment}
            onCommentUpdate={onCommentUpdate}
            currentUserId={currentUserId}
            level={0}
          />
          
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onCommentUpdate={onCommentUpdate}
              currentUserId={currentUserId}
              level={1}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commentContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  replyContainer: {
    marginLeft: 20,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: '#e0e0e0',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  commentDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  commentActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  commentContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  replyButtonText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  replyInput: {
    marginTop: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
});

export default CommentList;