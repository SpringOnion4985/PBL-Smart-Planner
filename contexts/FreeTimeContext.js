// FreeTimeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the context
const FreeTimeContext = createContext();

// Provider component
export const FreeTimeProvider = ({ children }) => {
  const [freeTime, setFreeTime] = useState({
    Monday: '',
    Tuesday: '',
    Wednesday: '',
    Thursday: '',
    Friday: '',
    Saturday: '',
    Sunday: '',
  });

  // Load free time from AsyncStorage when the app starts
  useEffect(() => {
    const loadFreeTime = async () => {
      try {
        const stored = await AsyncStorage.getItem('freeTime');
        if (stored) {
          const parsed = JSON.parse(stored);
          setFreeTime(parsed);
        }
      } catch (error) {
        console.error('Failed to load free time:', error);
      }
    };
    loadFreeTime();
  }, []);

  // Automatically save to AsyncStorage whenever freeTime updates
  useEffect(() => {
    const saveFreeTime = async () => {
      try {
        await AsyncStorage.setItem('freeTime', JSON.stringify(freeTime));
      } catch (error) {
        console.error('Failed to save free time:', error);
      }
    };
    saveFreeTime();
  }, [freeTime]);

  return (
    <FreeTimeContext.Provider value={{ freeTime, setFreeTime }}>
      {children}
    </FreeTimeContext.Provider>
  );
};

// Custom hook
export const useFreeTime = () => useContext(FreeTimeContext);
