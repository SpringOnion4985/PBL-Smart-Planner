import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView
} from 'react-native';
import { useTasks } from '../contexts/TaskContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

export default function TaskDetailScreen({ route, navigation }) {
  const { tasks, setTasks } = useTasks();
  const { task } = route.params;

  const [title, setTitle] = useState(task.title);
  const [duration, setDuration] = useState(String(task.duration));
  const [deadline, setDeadline] = useState(task.deadline);
  const [priority, setPriority] = useState(task.priority);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const updateTask = () => {
    if (!title || !duration || !deadline || !priority) {
      Alert.alert("Missing Fields", "Please fill all fields");
      return;
    }

    const updated = tasks.map(t =>
      t.title === task.title && t.deadline === task.deadline
        ? { ...t, title, duration: parseInt(duration), deadline, priority }
        : t
    );
    setTasks(updated);
    Alert.alert("Updated", "Task updated successfully");
    navigation.goBack();
  };

  const deleteTask = () => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: () => {
          setTasks(tasks.filter(t => !(t.title === task.title && t.deadline === task.deadline)));
          navigation.goBack();
        }
      }
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Duration (minutes)</Text>
      <TextInput style={styles.input} value={duration} onChangeText={setDuration} keyboardType="numeric" />

      <Text style={styles.label}>Deadline</Text>
      <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>{moment(deadline).format('YYYY-MM-DD')}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={new Date(deadline)}
          mode="date"
          display="default"
          onChange={(e, date) => {
            setShowDatePicker(false);
            if (date) setDeadline(moment(date).format('YYYY-MM-DD'));
          }}
        />
      )}

      <Text style={styles.label}>Priority</Text>
      <View style={styles.priorityRow}>
        {['High', 'Medium', 'Low'].map(p => (
          <TouchableOpacity
            key={p}
            style={[styles.priorityBtn, priority === p && styles.activePriority]}
            onPress={() => setPriority(p)}
          >
            <Text style={priority === p ? styles.activePriorityText : styles.priorityText}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={updateTask}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteBtn} onPress={deleteTask}>
        <Text style={styles.deleteText}>Delete Task</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20, backgroundColor: '#fff', flexGrow: 1
  },
  label: { fontWeight: '600', marginTop: 10, marginBottom: 4 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginBottom: 12
  },
  dateBtn: {
    backgroundColor: '#eee', padding: 10, borderRadius: 8, marginBottom: 12
  },
  dateText: { color: '#333' },
  priorityRow: { flexDirection: 'row', marginBottom: 16 },
  priorityBtn: {
    paddingVertical: 8, paddingHorizontal: 12,
    borderRadius: 20, backgroundColor: '#ddd', marginRight: 10
  },
  activePriority: { backgroundColor: '#4F6DF5' },
  priorityText: { color: '#333' },
  activePriorityText: { color: '#fff', fontWeight: '600' },
  saveBtn: {
    backgroundColor: '#4F6DF5', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 10
  },
  saveText: { color: '#fff', fontWeight: '600' },
  deleteBtn: {
    backgroundColor: '#f66', padding: 14, borderRadius: 10, alignItems: 'center'
  },
  deleteText: { color: '#fff', fontWeight: '600' },
});
