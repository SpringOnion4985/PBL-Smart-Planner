import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ImageToTextScreen({ route }) {
  const { rawText } = route.params;
  const navigation = useNavigation();

  const parsedFreeTime = {
    Monday: '7:00-9:00, 15:00-17:00',
    Tuesday: '10:00-12:00',
    Wednesday: '13:00-15:00',
    Thursday: '8:00-10:00, 16:00-18:00',
    Friday: '11:00-13:00',
    Saturday: '',
    Sunday: '',
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Extracted Timetable Text</Text>
      <Text style={styles.textBlock}>{rawText}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('SetFreeTime', {
            parsedFreeTime
          })
        }
      >
        <Text style={styles.buttonText}>Edit Free Time</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  textBlock: {
    backgroundColor: '#f1f1f1',
    padding: 16,
    borderRadius: 8,
    fontSize: 14,
    color: '#333'
  },
  button: {
    marginTop: 20,
    backgroundColor: '#4F6DF5',
    padding: 14,
    alignItems: 'center',
    borderRadius: 8
  },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});
