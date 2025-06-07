import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function FreeTimeScreen({ navigation }) {
  const [freeTime, setFreeTime] = useState(
    daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: '' }), {})
  );

  const handleInputChange = (day, value) => {
    setFreeTime({ ...freeTime, [day]: value });
  };

  const handleContinue = () => {
    console.log('Free time data:', freeTime);
    navigation.navigate('Tasks', { freeTime });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Enter your free time for each day (e.g., 8-10, 14-16)</Text>
      {daysOfWeek.map((day) => (
        <View key={day} style={styles.inputContainer}>
          <Text style={styles.label}>{day}</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 8-10, 14-16"
            value={freeTime[day]}
            onChangeText={(value) => handleInputChange(day, value)}
          />
        </View>
      ))}
      <Button title="Continue to Tasks" onPress={handleContinue} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
});
