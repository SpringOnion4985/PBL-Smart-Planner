import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { scheduleTasks } from '../utils/scheduler';
import { useTasks } from '../contexts/TaskContext';

export default function CalendarScreen({ route }) {
  const { tasks } = useTasks();

  const freeTime = useMemo(() => {
    return route?.params?.freeTime || {
      Monday: "9-11",
      Tuesday: "14-15",
      Wednesday: "8-10",
      Thursday: "",
      Friday: "",
      Saturday: "",
      Sunday: "",
    };
  }, [route?.params?.freeTime]);

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
            <Text style={styles.taskText}>
              📝 {item.taskTitle} ({item.minutesAllocated} min)
            </Text>
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
