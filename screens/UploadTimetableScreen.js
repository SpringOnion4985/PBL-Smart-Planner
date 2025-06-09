import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';

export default function UploadTimetableScreen() {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleUpload = async () => {
    const file = await DocumentPicker.getDocumentAsync({
      type: ['image/*', 'application/pdf'],
      copyToCacheDirectory: true,
    });

    if (file.canceled || !file.assets) return;

    setLoading(true);
    try {
      // Simulate parsing delay
      setTimeout(() => {
        const fakeExtractedText = `
Monday: 7:00-9:00, 15:00-17:00
Tuesday: 10:00-12:00
Wednesday: 13:00-15:00
Thursday: 8:00-10:00, 16:00-18:00
Friday: 11:00-13:00
Saturday:
Sunday:
        `.trim();

        navigation.navigate('ImageToText', {
          rawText: fakeExtractedText
        });

        setLoading(false);
      }, 2500); // 2.5 seconds
    } catch (err) {
      console.error('Fake parser error:', err);
      setLoading(false);
      Alert.alert('Error', 'Failed to process file.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Your Timetable</Text>

      <TouchableOpacity style={styles.button} onPress={handleUpload}>
        <Text style={styles.buttonText}>Choose Image (JPG/PNG)</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#4F6DF5" style={{ marginTop: 20 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  button: {
    backgroundColor: '#4F6DF5', padding: 16, borderRadius: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});
