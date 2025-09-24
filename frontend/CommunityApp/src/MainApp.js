import React from 'react';
import { StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import 'react-native-gesture-handler';

import { AuthProvider } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <AuthProvider>
        <AppNavigator />
        <Toast />
      </AuthProvider>
    </>
  );
};

export default App;
