import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, Feather } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import TaskInputScreen from '../screens/TaskInputScreen';
import CalendarScreen from '../screens/CalendarScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#4F6DF5',
        tabBarInactiveTintColor: '#999',
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Tasks') {
            return <Ionicons name="list-outline" size={size} color={color} />;
          } else if (route.name === 'Planner') {
            return <Feather name="clock" size={size} color={color} />;
          } else if (route.name === 'Calendar') {
            return <Ionicons name="calendar-outline" size={size} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="Planner" component={HomeScreen} />
      <Tab.Screen name="Tasks" component={TaskInputScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
    </Tab.Navigator>
  );
}
