import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList,
  ScrollView, StyleSheet, Alert, Image
} from 'react-native';
import moment from 'moment';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useTasks } from '../contexts/TaskContext';

const priorities = ['All', 'High', 'Medium', 'Low'];
const statuses = ['All', 'Completed', 'Active'];

const getWeekDates = () => {
  const today = moment();
  return [...Array(7)].map((_, i) => moment(today).add(i - 3, 'days'));
};

export default function TaskListScreen({ navigation }) {
  const { tasks, setTasks } = useTasks();
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [priority, setPriority] = useState('All');
  const [status, setStatus] = useState('All');

  const filteredTasks = tasks.filter(t =>
    (priority === 'All' || t.priority === priority) &&
    (status === 'All' || (status === 'Completed' ? t.completed : !t.completed)) &&
    t.deadline === selectedDate
  );

  const completedCount = filteredTasks.filter(t => t.completed).length;

  const toggleCompletion = (task) => {
    const updated = tasks.map(t =>
      t === task ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);
  };

  const deleteTask = (task) => {
    Alert.alert('Delete Task', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updated = tasks.filter(t => t !== task);
          setTasks(updated);
        }
      }
    ]);
  };

  const editTask = (task) => {
    navigation.navigate('AddTask', { task, edit: true });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.header}>Tasks</Text>
        <Ionicons name="ellipsis-vertical" size={22} color="#333" />
      </View>

      {/* Date Selector */}
      <Text style={styles.monthLabel}>{moment(selectedDate).format('MMMM YYYY')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateRow}>
        {getWeekDates().map((date, i) => {
          const dateStr = date.format('YYYY-MM-DD');
          return (
            <TouchableOpacity
              key={i}
              style={[styles.dateBox, selectedDate === dateStr && styles.activeDate]}
              onPress={() => setSelectedDate(dateStr)}
            >
              <Text style={styles.dateText}>{date.format('ddd')}</Text>
              <Text style={styles.dateNumber}>{date.format('D')}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Filters */}
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Priority:</Text>
        {priorities.map(p => (
          <TouchableOpacity
            key={p}
            style={[styles.filterBtn, priority === p && styles.activeFilter]}
            onPress={() => setPriority(p)}
          >
            <Text style={priority === p ? styles.activeFilterText : styles.filterText}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Status:</Text>
        {statuses.map(s => (
          <TouchableOpacity
            key={s}
            style={[styles.filterBtn, status === s && styles.activeFilter]}
            onPress={() => setStatus(s)}
          >
            <Text style={status === s ? styles.activeFilterText : styles.filterText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task List */}
      <View style={styles.taskContainer}>
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Image source={require('../assets/tasklist.png')} style={{ width: 60, height: 60 }} />
            <Text style={styles.emptyText}>No tasks found</Text>
            <Text style={styles.emptyHint}>Tap the + button to add a new task</Text>
          </View>
        ) : (
          <FlatList
            data={filteredTasks}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.taskItem}>
                <TouchableOpacity onPress={() => toggleCompletion(item)}>
                  <Ionicons
                    name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
                    size={24}
                    color={item.completed ? '#4CAF50' : '#555'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1, marginLeft: 10 }}
                  onPress={() => navigation.navigate('TaskDetail', { task: item })}
                >
                  <Text style={[styles.taskTitle, item.completed && styles.completedTask]}>
                    {item.title}
                  </Text>
                  <Text style={styles.taskMeta}>
                    {item.duration} mins | Priority: {item.priority}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => editTask(item)}>
                  <Feather name="edit" size={20} color="#333" style={{ marginRight: 12 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTask(item)}>
                  <Feather name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>

      {/* Summary */}
      <View style={styles.summaryBar}>
        <Text style={styles.summaryText}>
          {completedCount}/{filteredTasks.length} Tasks Completed
        </Text>
      </View>

      {/* Floating Button */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddTask')}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  header: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  monthLabel: { marginTop: 16, fontSize: 16, fontWeight: '600', color: '#555' },
  dateRow: { flexDirection: 'row', marginVertical: 12 },
  dateBox: {
    width: 50, alignItems: 'center', paddingVertical: 10, borderRadius: 10,
    marginRight: 10, backgroundColor: '#eee'
  },
  activeDate: { backgroundColor: '#4F6DF5' },
  dateText: { fontSize: 12, color: '#444' },
  dateNumber: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  filterRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' },
  filterLabel: { marginRight: 10, fontSize: 14, fontWeight: '600' },
  filterBtn: {
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20,
    backgroundColor: '#eee', marginRight: 8, marginBottom: 6
  },
  activeFilter: { backgroundColor: '#4F6DF5' },
  filterText: { fontSize: 13, color: '#555' },
  activeFilterText: { color: '#fff', fontWeight: '600' },
  taskContainer: { flex: 1 },
  taskItem: {
    flexDirection: 'row', alignItems: 'center', padding: 10,
    borderBottomWidth: 1, borderBottomColor: '#ddd'
  },
  taskTitle: { fontSize: 15, fontWeight: '600' },
  completedTask: { textDecorationLine: 'line-through', color: '#aaa' },
  taskMeta: { fontSize: 12, color: '#666' },
  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 16, fontWeight: '600', marginTop: 12 },
  emptyHint: { fontSize: 13, color: '#777', textAlign: 'center', marginTop: 4 },
  summaryBar: {
    backgroundColor: '#f1f1f1', padding: 10, alignItems: 'center',
    borderRadius: 12, marginTop: 12,
  },
  summaryText: { color: '#555', fontWeight: '600' },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    backgroundColor: '#4F6DF5', width: 50, height: 50,
    borderRadius: 25, alignItems: 'center', justifyContent: 'center'
  },
  fabText: { fontSize: 30, color: '#fff', marginBottom: 2 },
});
