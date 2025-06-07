import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, ScrollView
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useUser } from '../contexts/UserContext';
import { useTasks } from '../contexts/TaskContext';
import { scheduleTasks } from '../utils/scheduler';
import moment from 'moment';

export default function HomeScreen({ navigation }) {
  const { user } = useUser();
  const { tasks, setTasks } = useTasks();

  const today = moment().format('YYYY-MM-DD');
  const todayTasks = tasks.filter(t => t.deadline === today);
  const completedTasks = todayTasks.filter(t => t.completed);
  const nextTask = todayTasks.find(t => !t.completed);

  const handleOptimize = () => {
    // Dummy free time for now
    const freeTime = {
      Monday: "9-11",
      Tuesday: "10-12",
      Wednesday: "14-16",
      Thursday: "",
      Friday: "",
      Saturday: "",
      Sunday: "",
    };

    const newSchedule = scheduleTasks(freeTime, tasks);
    console.log("Optimized Schedule:", newSchedule);

    // Merge scheduled times back into tasks (optional)
    const updatedTasks = tasks.map(task => {
      const scheduled = newSchedule.find(s => s.taskTitle === task.title);
      return scheduled ? { ...task, scheduled: true } : task;
    });

    setTasks(updatedTasks);
    alert("Schedule optimized!");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good day, {user.username || 'Guest'}!</Text>
          <Text style={styles.subtext}>Let's manage your time efficiently</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.welcomeCard}>
        <Image source={require('../assets/icon.png')} style={styles.welcomeImage} />
        <Text style={styles.welcomeText}>Welcome! Add some tasks to get started.</Text>
      </View>

      <View style={styles.progressCard}>
        <Text style={styles.cardHeader}>Today's Progress</Text>
        <Text style={styles.cardSub}>
          {completedTasks.length}/{todayTasks.length} Tasks
        </Text>
        <TouchableOpacity style={styles.optimizeBtn} onPress={handleOptimize}>
          <Text style={styles.optimizeText}>Optimize Schedule</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.comingUpCard}>
        <Text style={styles.cardHeader}>Coming Up Next</Text>
        <Text style={styles.cardSub}>
          {nextTask ? `${nextTask.title} - ${nextTask.deadline}` : 'No upcoming tasks for today'}
        </Text>
      </View>

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Tasks')}>
          <Ionicons name="list-outline" size={24} color="#555" />
          <Text style={styles.navLabel}>Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Planner')}>
          <Feather name="clock" size={24} color="#555" />
          <Text style={styles.navLabel}>Planner</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Calendar')}>
          <Ionicons name="calendar-outline" size={24} color="#555" />
          <Text style={styles.navLabel}>Calendar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.taskSection}>
        <Text style={styles.taskTitle}>Today's Tasks</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.noTasks}>
        <Text style={styles.noTasksText}>
          {todayTasks.length > 0
            ? 'Keep going!'
            : 'No tasks for today. Add some tasks to get started!'}
        </Text>
      </View>

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Tasks')}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20
  },
  greeting: { fontSize: 22, fontWeight: 'bold' },
  subtext: { color: '#777' },
  welcomeCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9',
    padding: 16, borderRadius: 12, marginBottom: 16,
  },
  welcomeImage: { width: 40, height: 40, marginRight: 12 },
  welcomeText: { fontSize: 14, color: '#444' },
  progressCard: {
    backgroundColor: '#f9f9f9', padding: 16, borderRadius: 12, marginBottom: 16
  },
  cardHeader: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  cardSub: { color: '#777', marginBottom: 10 },
  optimizeBtn: {
    backgroundColor: '#4F6DF5', paddingVertical: 10, borderRadius: 8, alignItems: 'center'
  },
  optimizeText: { color: '#fff', fontWeight: '600' },
  comingUpCard: {
    backgroundColor: '#f9f9f9', padding: 16, borderRadius: 12, marginBottom: 16
  },
  navBar: {
    flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, marginBottom: 16,
    backgroundColor: '#f1f1f1', borderRadius: 12,
  },
  navItem: { alignItems: 'center' },
  navLabel: { fontSize: 12, marginTop: 4, color: '#555' },
  taskSection: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: { fontSize: 16, fontWeight: '600' },
  seeAll: { color: '#4F6DF5' },
  noTasks: {
    backgroundColor: '#f1f1f1', padding: 16, borderRadius: 12, marginBottom: 100
  },
  noTasksText: { textAlign: 'center', color: '#666' },
  fab: {
    position: 'absolute', right: 20, bottom: 30, width: 50, height: 50,
    borderRadius: 25, backgroundColor: '#4F6DF5', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4,
    elevation: 5
  },
  fabText: { color: '#fff', fontSize: 30, lineHeight: 30 },
});
