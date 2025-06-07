import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { scheduleTasks } from '../utils/scheduler';

export default function CalendarScreen({ route }) {
  const { freeTime, tasks } = route.params;
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const generatedSchedule = scheduleTasks(freeTime, tasks);
    setSchedule(generatedSchedule);
  }, [freeTime, tasks]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Scheduled Tasks</Text>
      {schedule.length === 0 ? (
        <Text>No tasks scheduled</Text>
      ) : (
        schedule.map((item, index) => (
          <View key={index} style={styles.taskBlock}>
            <Text style={styles.taskText}>
              📅 {item.date} | 🕒 {item.start}:00 - {item.end}:00
            </Text>
            <Text style={styles.taskText}>📝 {item.taskTitle} ({item.minutesAllocated} min)</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  taskBlock: { marginBottom: 12, padding: 10, borderWidth: 1, borderRadius: 8, borderColor: '#ccc' },
  taskText: { fontSize: 16 }
});
