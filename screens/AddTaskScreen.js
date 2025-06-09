import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Platform
} from 'react-native';
import { useTasks } from '../contexts/TaskContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

export default function AddTaskScreen({ navigation, route }) {
  const { tasks, setTasks } = useTasks();
  const isEdit = route?.params?.edit;
  const editingTask = route?.params?.task;

  const [title, setTitle] = useState(editingTask?.title || '');
  const [duration, setDuration] = useState(editingTask?.duration?.toString() || '');
  const [priority, setPriority] = useState(editingTask?.priority || 'Medium');
  const [deadline, setDeadline] = useState(
    editingTask ? moment(editingTask.deadline, 'YYYY-MM-DD').toDate() : new Date()
  );
  const [showPicker, setShowPicker] = useState(false);

  const handleSubmit = () => {
    if (!title || !duration) {
      alert("Please enter task title and duration.");
      return;
    }

    const taskData = {
      id: isEdit ? editingTask.id : Date.now().toString(), // ✅ assign ID
      title,
      duration: parseInt(duration),
      deadline: moment(deadline).format('YYYY-MM-DD'),
      priority,
      completed: editingTask?.completed || false
    };

    if (isEdit) {
      const updatedTasks = tasks.map(task =>
        task.id === editingTask.id ? taskData : task
      );
      setTasks(updatedTasks);
    } else {
      setTasks([...tasks, taskData]);
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{isEdit ? 'Edit Task' : 'Add New Task'}</Text>

      <TextInput
        placeholder="Task Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Duration (in minutes)"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        style={styles.input}
      />

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

      <Text style={styles.label}>Deadline</Text>
      <TouchableOpacity
        style={styles.deadlineBtn}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.deadlineText}>{moment(deadline).format('YYYY-MM-DD')}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={deadline}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDeadline(selectedDate);
          }}
        />
      )}

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>{isEdit ? 'Update Task' : 'Add Task'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 12, marginBottom: 12
  },
  label: { fontWeight: '600', marginTop: 10 },
  priorityRow: { flexDirection: 'row', marginVertical: 10 },
  priorityBtn: {
    padding: 10, borderRadius: 8, marginRight: 10,
    backgroundColor: '#eee',
  },
  activePriority: { backgroundColor: '#4F6DF5' },
  priorityText: { color: '#333' },
  activePriorityText: { color: '#fff', fontWeight: '600' },
  deadlineBtn: {
    padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    marginTop: 8, marginBottom: 20
  },
  deadlineText: { color: '#333' },
  submitBtn: {
    backgroundColor: '#4F6DF5', padding: 14,
    alignItems: 'center', borderRadius: 8
  },
  submitText: { color: '#fff', fontWeight: 'bold' }
});
