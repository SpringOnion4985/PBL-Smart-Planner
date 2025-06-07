import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, FlatList, Image
} from 'react-native';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';

const priorities = ['All', 'High', 'Medium', 'Low'];
const statuses = ['All', 'Completed', 'Active'];

const getWeekDates = () => {
  const today = moment();
  return [...Array(7)].map((_, i) => moment(today).add(i - 3, 'days'));
};

export default function TaskListScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [priority, setPriority] = useState('All');
  const [status, setStatus] = useState('All');

  const tasks = []; // Replace with real task fetching logic later

  const filteredTasks = tasks.filter(t => {
    return (
      (priority === 'All' || t.priority === priority) &&
      (status === 'All' || (status === 'Completed' ? t.completed : !t.completed)) &&
      t.date === selectedDate
    );
  });

  const completedCount = filteredTasks.filter(t => t.completed).length;

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
            <Text style={styles.emptyHint}>Tap the + button to add a new task for this day</Text>
          </View>
        ) : (
          <FlatList
            data={filteredTasks}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Text>{item.title}</Text>}
          />
        )}
      </View>

      {/* Bottom Task Summary */}
      <View style={styles.summaryBar}>
        <Text style={styles.summaryText}>{completedCount}/{filteredTasks.length} Tasks Complete</Text>
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
    width: 50, alignItems: 'center', paddingVertical: 10, borderRadius: 10, marginRight: 10,
    backgroundColor: '#eee'
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
  taskContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
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
