import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { UserProvider } from './contexts/UserContext';
import { TaskProvider } from './contexts/TaskContext';

export default function App() {
  return (
    <UserProvider>
      <TaskProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </TaskProvider>
    </UserProvider>
  );
}
