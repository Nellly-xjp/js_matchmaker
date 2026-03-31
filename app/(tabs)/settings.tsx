import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useAuth } from '../ctx/auth';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const [maxAge, setMaxAge] = useState(35);
  const [notifications, setNotifications] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Налаштування</Text>

      {user && (
        <View style={styles.userCard}>
          <Text style={styles.label}>Поточний користувач</Text>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userLogin}>@{user.username}</Text>
        </View>
      )}

      <TextInput
        label="Максимальний вік"
        value={maxAge.toString()}
        onChangeText={(t) => setMaxAge(parseInt(t) || 18)}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />

      <Button 
        mode="outlined" 
        onPress={() => setNotifications(!notifications)}
        style={styles.button}
      >
        Сповіщення: {notifications ? 'Увімкнено' : 'Вимкнено'}
      </Button>

      <Button 
        mode="contained" 
        buttonColor="#FF2D55"
        onPress={logout}
        style={styles.logoutButton}
      >
        Вийти з акаунту
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#FF2D55' },
  userCard: { backgroundColor: '#f0f0f0', padding: 16, borderRadius: 12, marginBottom: 30 },
  label: { fontSize: 14, color: '#666' },
  userName: { fontSize: 20, fontWeight: 'bold' },
  userLogin: { fontSize: 16, color: '#888' },
  input: { marginBottom: 20 },
  button: { marginBottom: 15 },
  logoutButton: { marginTop: 40 },
});