import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CommentInput = ({ 
  onSubmit, 
  onCancel, 
  placeholder = "댓글을 작성하세요", 
  submitText = "작성",
  initialValue = "",
  style 
}) => {
  const [comment, setComment] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (!comment.trim()) return;
    
    onSubmit(comment.trim());
    setComment('');
    setIsFocused(false);
  };

  const handleCancel = () => {
    setComment(initialValue);
    setIsFocused(false);
    if (onCancel) onCancel();
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            isFocused && styles.inputFocused,
          ]}
          value={comment}
          onChangeText={setComment}
          placeholder={placeholder}
          placeholderTextColor="#999"
          multiline
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        <TouchableOpacity
          style={[
            styles.submitButton,
            comment.trim() ? styles.submitButtonActive : styles.submitButtonInactive,
          ]}
          onPress={handleSubmit}
          disabled={!comment.trim()}
        >
          <Icon 
            name="send" 
            size={20} 
            color={comment.trim() ? '#2196F3' : '#ccc'} 
          />
        </TouchableOpacity>
      </View>
      
      {(isFocused || onCancel) && (
        <View style={styles.actionBar}>
          {onCancel && (
            <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
              <Text style={styles.cancelText}>취소</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            onPress={handleSubmit}
            style={[
              styles.submitTextButton,
              !comment.trim() && styles.submitTextButtonDisabled,
            ]}
            disabled={!comment.trim()}
          >
            <Text style={[
              styles.submitButtonText,
              !comment.trim() && styles.submitButtonTextDisabled,
            ]}>
              {submitText}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 40,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    maxHeight: 100,
    paddingVertical: 8,
  },
  inputFocused: {
    backgroundColor: 'transparent',
  },
  submitButton: {
    marginLeft: 8,
    padding: 4,
  },
  submitButtonActive: {
    // 활성 상태 스타일
  },
  submitButtonInactive: {
    // 비활성 상태 스타일
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  cancelText: {
    fontSize: 14,
    color: '#666',
  },
  submitTextButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  submitTextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  submitButtonTextDisabled: {
    color: '#999',
  },
});

export default CommentInput;