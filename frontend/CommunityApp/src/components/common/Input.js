import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Input = ({ 
  label, 
  error, 
  secureTextEntry = false, 
  multiline = false,
  style,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // 안전하게 문자열로 변환
  const safeLabel = label == null ? '' : String(label);
  const safeError = error == null ? '' : String(error);
  const safeValue = props.value == null ? '' : String(props.value);

  return (
    <View style={[styles.container, style]}>
      {safeLabel !== '' && <Text style={styles.label}>{safeLabel}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            isFocused && styles.focused,
            safeError !== '' && styles.error,
          ]}
          secureTextEntry={secureTextEntry && !showPassword}
          multiline={multiline}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={safeValue}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        )}
      </View>
      {safeError !== '' && <Text style={styles.errorText}>{safeError}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  focused: {
    borderColor: '#2196F3',
  },
  error: {
    borderColor: '#f44336',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;