// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { UserProvider } from './contexts/UserContext';
import { TaskProvider } from './contexts/TaskContext';
import { FreeTimeProvider } from './contexts/FreeTimeContext';

export default function App() {
  return (
    <NavigationContainer>
      <UserProvider>
        <TaskProvider>
          <FreeTimeProvider>
            <AppNavigator />
          </FreeTimeProvider>
        </TaskProvider>
      </UserProvider>
    </NavigationContainer>
  );
}
