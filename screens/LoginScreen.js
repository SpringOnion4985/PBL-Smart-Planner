import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const handleStart = () => {
    // You can pass username/email to next screen if needed
    navigation.navigate('Main'); // Navigates to bottom tabs (Planner/Home)
  };

  const handleSkip = () => {
    navigation.navigate('Main');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={require('../assets/icon.png')} style={styles.logo} />

        <Text style={styles.title}>TimeSlotManager</Text>
        <Text style={styles.subtitle}>Optimize your day, one slot at a time</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>

        <View style={styles.features}>
          <Text style={styles.featureTitle}>Key Features</Text>

          <View style={styles.featureItem}>
            <Text style={styles.emoji}>🕒</Text>
            <View>
              <Text style={styles.featureHeading}>Smart Scheduling</Text>
              <Text style={styles.featureDescription}>
                Automatically schedules tasks based on priority and duration
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.emoji}>🗂️</Text>
            <View>
              <Text style={styles.featureHeading}>Task Management</Text>
              <Text style={styles.featureDescription}>
                Organize tasks with priorities, durations, and completion tracking
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.emoji}>📅</Text>
            <View>
              <Text style={styles.featureHeading}>Calendar Integration</Text>
              <Text style={styles.featureDescription}>
                Visualize your scheduled tasks in a calendar view
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginVertical: 20,
    borderRadius: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
    fontSize: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#4F6DF5',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  skipText: {
    marginTop: 12,
    color: '#777',
    textDecorationLine: 'underline',
  },
  features: {
    width: '100%',
    marginTop: 32,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 24,
    marginRight: 12,
  },
  featureHeading: {
    fontSize: 16,
    fontWeight: '600',
  },
  featureDescription: {
    fontSize: 14,
    color: '#555',
  },
});
