import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const { user, setUser } = useUser();
  const navigation = useNavigation();

  useEffect(() => {
    const checkLogin = async () => {
      const stored = await AsyncStorage.getItem('user');
      if (stored) {
        const parsedUser = JSON.parse(stored);
        setUser(parsedUser);
        Alert.alert(`Welcome back, ${parsedUser.username}!`);
        navigation.replace('Main'); // ✅ Corrected
      }
    };
    checkLogin();
  }, []);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const saveLoginHistory = async (entry) => {
    const history = JSON.parse(await AsyncStorage.getItem('loginHistory')) || [];
    history.unshift({ ...entry, timestamp: new Date().toISOString() });
    await AsyncStorage.setItem('loginHistory', JSON.stringify(history.slice(0, 10)));
  };

  const handleStart = async () => {
    if (!username || !email) {
      Alert.alert('Please enter both username and email.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Please enter a valid email address.');
      return;
    }

    const userData = { username, email };
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    await saveLoginHistory(userData);
    setUser(userData);
    navigation.replace('Main'); // ✅ Corrected
  };

  const handleSkip = async () => {
    const guestData = { username: 'Guest', email: '' };
    await AsyncStorage.setItem('user', JSON.stringify(guestData));
    await saveLoginHistory(guestData);
    setUser(guestData);
    navigation.replace('Main'); // ✅ Corrected
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={require('../assets/icon.jpg')} style={styles.logo} />
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
