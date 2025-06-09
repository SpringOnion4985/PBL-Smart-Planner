import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFreeTime } from '../contexts/FreeTimeContext';
import { useNavigation } from '@react-navigation/native';

export default function SetFreeTimeScreen({ route }) {
  const navigation = useNavigation();
  const { setFreeTime } = useFreeTime();
  const parsedFreeTime = route?.params?.parsedFreeTime || {};

  const [slots, setSlots] = useState({
    Monday: '', Tuesday: '', Wednesday: '',
    Thursday: '', Friday: '', Saturday: '', Sunday: ''
  });

  useEffect(() => {
    if (Object.keys(parsedFreeTime).length > 0) {
      setSlots(prev => ({
        ...prev,
        ...parsedFreeTime,
      }));
    }
  }, [parsedFreeTime]);

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('freeTime', JSON.stringify(slots));
      setFreeTime(slots);
      Alert.alert('Success', 'Your free time has been saved.');
      navigation.navigate('Main', { screen: 'Planner' }); // ✅ back to dashboard
    } catch (error) {
      console.error('Error saving free time:', error);
      Alert.alert('Error', 'Failed to save free time.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Set Your Weekly Free Time</Text>

      {Object.keys(slots).map(day => (
        <View key={day} style={styles.row}>
          <Text style={styles.label}>{day}</Text>
          <TextInput
            placeholder="e.g., 9-11, 14-16"
            value={slots[day]}
            onChangeText={text => setSlots({ ...slots, [day]: text })}
            style={styles.input}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#fff', flexGrow: 1 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  row: { marginBottom: 14 },
  label: { fontWeight: '600', marginBottom: 4 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 12, backgroundColor: '#f9f9f9'
  },
  button: {
    marginTop: 24, backgroundColor: '#4F6DF5', padding: 14,
    alignItems: 'center', borderRadius: 8
  },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});
