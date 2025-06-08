import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView,
  TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import { useFreeTime } from '../contexts/FreeTimeContext';
import { Ionicons } from '@expo/vector-icons';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function SetFreeTimeScreen({ navigation }) {
  const { freeTime, setFreeTime } = useFreeTime();  // ✅ Use context
  const [form, setForm] = useState(freeTime);       // Load existing times

  const handleSave = () => {
    setFreeTime(form);   // ✅ Save changes to global context
    Alert.alert("Saved", "Your weekly availability has been updated.");
    navigation.goBack();
  };

  const handleChange = (day, value) => {
    setForm(prev => ({ ...prev, [day]: value }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Set Weekly Free Time</Text>

      {weekdays.map(day => (
        <View key={day} style={styles.inputRow}>
          <Text style={styles.label}>{day}</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 9-11, 14-16"
            value={form[day]}
            onChangeText={text => handleChange(day, text)}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Ionicons name="save-outline" size={22} color="#fff" />
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  inputRow: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, backgroundColor: '#f9f9f9'
  },
  saveBtn: {
    backgroundColor: '#4F6DF5', padding: 14, borderRadius: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
  },
  saveText: { color: '#fff', fontSize: 16, marginLeft: 6 }
});
