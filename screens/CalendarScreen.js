import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useTasks } from '../contexts/TaskContext';
import moment from 'moment';

export default function CalendarScreen({ navigation }) {
  const { tasks, setTasks } = useTasks();
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));

  const dateTasks = tasks.filter(task => task.deadline === selectedDate);

  const toggleCompletion = (taskIndex) => {
    const updated = [...tasks];
    const realIndex = tasks.findIndex(t => t === dateTasks[taskIndex]);
    if (realIndex !== -1) {
      updated[realIndex].completed = !updated[realIndex].completed;
      setTasks(updated);
    }
  };

  const markedDates = tasks.reduce((acc, task) => {
    const date = task.deadline;
    if (!acc[date]) {
      acc[date] = { marked: true, dotColor: '#4F6DF5' };
    }
    return acc;
  }, { [selectedDate]: { selected: true, selectedColor: '#4F6DF5' } });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Calendar View</Text>

      <Calendar
        onDayPress={day => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: '#4F6DF5',
          todayTextColor: '#4F6DF5',
          arrowColor: '#4F6DF5',
        }}
      />

      <Text style={styles.subheader}>Tasks on {selectedDate}</Text>
      {dateTasks.length === 0 ? (
        <Text style={styles.noTask}>No tasks for this date.</Text>
      ) : (
        <FlatList
          data={dateTasks}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.taskItem}>
              <TouchableOpacity onPress={() => toggleCompletion(index)}>
                <Text style={{ fontSize: 18 }}>
                  {item.completed ? '✅' : '⬜️'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginLeft: 12 }}
                onPress={() => navigation.navigate('TaskDetail', { task: item })}
              >
                <Text
                  style={[
                    styles.taskText,
                    item.completed && styles.completedTask,
                  ]}
                >
                  {item.title} ({item.duration} mins)
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subheader: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  taskText: {
    fontSize: 14,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  noTask: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
  },
});
