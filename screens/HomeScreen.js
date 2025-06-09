import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { useUser } from '../contexts/UserContext';
import { useTasks } from '../contexts/TaskContext';
import { useFreeTime } from '../contexts/FreeTimeContext';
import { calculateFreeHoursToday } from '../utils/calculateFreeHours';

export default function HomeScreen({ navigation }) {
  const { user } = useUser();
  const { tasks } = useTasks();
  const { freeTime } = useFreeTime();

  const today = moment().format('YYYY-MM-DD');
  const todayTasks = tasks.filter(t => t.deadline === today);
  const completed = todayTasks.filter(t => t.completed).length;
  const todayFreeHours = calculateFreeHoursToday(freeTime);

  return (
    <ScrollView style={styles.container}>
      {/* Top bar with title and settings */}
      <View style={styles.topBar}>
        <Text style={styles.header}>Dashboard</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtext}>Manage your schedule and find optimal collaboration times</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{todayFreeHours}h</Text>
          <Text style={styles.statLabel}>Free Hours Today</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{completed}/{todayTasks.length}</Text>
          <Text style={styles.statLabel}>Tasks Completed</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Active Collaborations</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Upcoming Events</Text>
        </View>
      </View>

      {/* Upload Timetable Section */}
      <View style={styles.card}>
        <Text style={styles.sectionHeader}>Upload Timetable</Text>
        <View style={styles.uploadBox}>
          <Ionicons name="cloud-upload-outline" size={32} color="#4F6DF5" />
          <Text style={styles.uploadText}>Upload your timetable</Text>
          <Text style={styles.uploadHint}>Supports PDF, JPG, PNG</Text>
          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={() => navigation.navigate('UploadTimetable')}
          >
            <Text style={styles.uploadBtnText}>Choose File</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Add Task */}
      <View style={styles.card}>
        <Text style={styles.sectionHeader}>Quick Add Task</Text>
        <TouchableOpacity style={styles.quickAddBtn} onPress={() => navigation.navigate('AddTask')}>
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.quickAddText}>Add Task</Text>
        </TouchableOpacity>
      </View>

      {/* Today’s Tasks */}
      <View style={styles.card}>
        <Text style={styles.sectionHeader}>Today’s Tasks</Text>
        {todayTasks.length === 0 ? (
          <Text style={styles.emptyText}>No tasks for today</Text>
        ) : (
          todayTasks.map((t, i) => (
            <View key={i} style={styles.taskRow}>
              <Text>{t.title} - {t.duration}m</Text>
            </View>
          ))
        )}
      </View>

      {/* Collaborations */}
      <View style={styles.card}>
        <Text style={styles.sectionHeader}>Active Collaborations</Text>
        <Text style={styles.emptyText}>No collaborations yet</Text>
        <TouchableOpacity style={styles.collabBtn}>
          <Text style={styles.collabBtnText}>+ New Collaboration</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  header: { fontSize: 22, fontWeight: 'bold' },
  subtext: { color: '#666', marginBottom: 16 },
  statsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statBox: {
    width: '47%',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  statValue: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: '#666' },
  card: {
    backgroundColor: '#fafafa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionHeader: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  uploadBox: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 20,
    alignItems: 'center', backgroundColor: '#fff'
  },
  uploadText: { fontWeight: '600', fontSize: 14, marginTop: 6 },
  uploadHint: { fontSize: 12, color: '#999', marginBottom: 10 },
  uploadBtn: {
    backgroundColor: '#4F6DF5', paddingVertical: 10, paddingHorizontal: 20,
    borderRadius: 8, marginTop: 8
  },
  uploadBtnText: { color: '#fff', fontWeight: 'bold' },

  quickAddBtn: {
    flexDirection: 'row', backgroundColor: '#4F6DF5',
    padding: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center'
  },
  quickAddText: { color: '#fff', fontWeight: '600', marginLeft: 6 },

  taskRow: {
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee'
  },
  emptyText: { color: '#888', fontStyle: 'italic' },

  collabBtn: {
    backgroundColor: '#EEE6FF', paddingVertical: 10,
    borderRadius: 10, marginTop: 10, alignItems: 'center'
  },
  collabBtnText: { color: '#4F6DF5', fontWeight: '600' },
});
