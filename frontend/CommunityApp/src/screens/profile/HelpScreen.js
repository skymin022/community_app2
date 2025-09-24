import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HelpScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>도움말</Text>
      <Text style={styles.text}>앱 사용에 도움이 필요하신가요? 문의: admin@example.com</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  text: { fontSize: 16, color: '#666' },
});

export default HelpScreen;
