import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useAuth } from '../context/AuthContext';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main Screens
import PostListScreen from '../screens/post/PostListScreen';
import PostDetailScreen from '../screens/post/PostDetailScreen';
import CreatePostScreen from '../screens/post/CreatePostScreen';
import EditPostScreen from '../screens/post/EditPostScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const PostStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="PostList" 
      component={PostListScreen}
      options={{ title: '게시글 목록' }}
    />
    <Stack.Screen 
      name="PostDetail" 
      component={PostDetailScreen}
      options={{ title: '게시글 상세' }}
    />
    <Stack.Screen 
      name="CreatePost" 
      component={CreatePostScreen}
      options={{ title: '게시글 작성' }}
    />
    <Stack.Screen 
      name="EditPost" 
      component={EditPostScreen}
      options={{ title: '게시글 수정' }}
    />
  </Stack.Navigator>
);

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        
        if (route.name === 'Posts') {
          iconName = 'article';
        } else if (route.name === 'Profile') {
          iconName = 'person';
        }
        
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#2196F3',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen 
      name="Posts" 
      component={PostStackNavigator}
      options={{ title: '게시글', headerShown: false }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{ title: '프로필' }}
    />
  </Tab.Navigator>
);

const AuthStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // 로딩 컴포넌트로 대체 가능
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;