// FreeTimeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FreeTimeContext = createContext();

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

  useEffect(() => {
    const loadFreeTime = async () => {
      try {
        const storedTime = await AsyncStorage.getItem('freeTime');
        if (storedTime) setFreeTime(JSON.parse(storedTime));
      } catch (e) {
        console.error('Error loading free time', e);
      }
    };
    loadFreeTime();
  }, []);

  useEffect(() => {
    const saveFreeTime = async () => {
      try {
        await AsyncStorage.setItem('freeTime', JSON.stringify(freeTime));
      } catch (e) {
        console.error('Error saving free time', e);
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

export const useFreeTime = () => useContext(FreeTimeContext);