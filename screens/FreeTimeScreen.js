import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFreeTime } from '../contexts/FreeTimeContext';
import { Ionicons } from '@expo/vector-icons';

export default function FreeTimeScreen({ navigation }) {
  const { freeTime } = useFreeTime();

  const renderDayRow = (day, slot) => (
    <View key={day} style={styles.dayRow}>
      <Text style={styles.dayText}>{day}</Text>
      <Text style={styles.timeText}>{slot || 'No Free Time Set'}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Your Weekly Free Time</Text>

      {Object.keys(freeTime).map(day => renderDayRow(day, freeTime[day]))}

      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => navigation.navigate('SetFreeTime')}
      >
        <Ionicons name="create-outline" size={20} color="#fff" />
        <Text style={styles.editBtnText}>Edit Free Time</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f1f1f1',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timeText: {
    fontSize: 16,
    color: '#555',
  },
  editBtn: {
    flexDirection: 'row',
    backgroundColor: '#4F6DF5',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  editBtnText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
});
