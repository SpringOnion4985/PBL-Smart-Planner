// screens/CalendarScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, Alert
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useTasks } from '../contexts/TaskContext';
import { Ionicons, Feather } from '@expo/vector-icons';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

export default function CalendarScreen() {
  const { tasks, setTasks } = useTasks();
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const navigation = useNavigation();

  const handleToggleComplete = (task) => {
    const updated = tasks.map(t =>
      t.title === task.title && t.deadline === task.deadline
        ? { ...t, completed: !t.completed }
        : t
    );
    setTasks(updated);
  };

  const handleDelete = (task) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: () => {
          setTasks(tasks.filter(t => !(t.title === task.title && t.deadline === task.deadline)));
        }
      }
    ]);
  };

  const filteredTasks = tasks.filter(t => t.deadline === selectedDate);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Calendar</Text>

      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: '#4F6DF5' }
        }}
        theme={{
          todayTextColor: '#4F6DF5',
        }}
      />

      <Text style={styles.dateText}>
        {moment(selectedDate).format('dddd, MMMM D, YYYY')}
      </Text>

      {filteredTasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={40} color="#ccc" />
          <Text style={styles.emptyText}>No tasks for this day</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item, index) => `${item.title}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <TouchableOpacity onPress={() => handleToggleComplete(item)}>
                <Ionicons
                  name={item.completed ? "checkmark-circle" : "ellipse-outline"}
                  size={24}
                  color={item.completed ? "#4F6DF5" : "#aaa"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('TaskDetail', { task: item })}
                style={{ flex: 1 }}
              >
                <Text style={[styles.taskTitle, item.completed && styles.completedTask]}>
                  {item.title}
                </Text>
                <Text style={styles.taskInfo}>
                  {item.duration} min • {item.priority}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item)}>
                <Feather name="trash-2" size={20} color="#f66" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  dateText: { fontSize: 14, color: '#444', marginTop: 10, textAlign: 'center' },
  taskCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f1f1',
    padding: 12, borderRadius: 10, marginVertical: 6
  },
  taskTitle: { fontSize: 16, fontWeight: '600', marginLeft: 10 },
  completedTask: { textDecorationLine: 'line-through', color: '#888' },
  taskInfo: { fontSize: 12, color: '#555', marginLeft: 10 },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { marginTop: 12, fontSize: 16, color: '#888' },
  fab: {
    position: 'absolute', right: 20, bottom: 30, backgroundColor: '#4F6DF5',
    width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center'
  },
  fabText: { color: '#fff', fontSize: 30 },
});
