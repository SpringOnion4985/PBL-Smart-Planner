import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasksState] = useState([]);

  // Load tasks from AsyncStorage on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const stored = await AsyncStorage.getItem('tasks');
        if (stored) setTasksState(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load tasks:', e);
      }
    };
    loadTasks();
  }, []);

  // Save tasks to AsyncStorage
  const setTasks = async (newTasks) => {
    setTasksState(newTasks);
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
    } catch (e) {
      console.error('Failed to save tasks:', e);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
