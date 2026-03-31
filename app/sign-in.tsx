import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useAuth } from './ctx/auth';
import { router } from 'expo-router';

export default function SignInScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = () => {
    if (login(username.trim(), password)) {
      router.replace('/(tabs)/profiles');   // ← Найстабільніший варіант
    } else {
      Alert.alert('Помилка', 'Невірний логін або пароль!\n\nСпробуйте:\nadmin / 1234\nuser / 1111');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>MatchMaker ❤️</Text>
      <Text variant="titleMedium" style={styles.subtitle}>Увійдіть в акаунт</Text>

      <TextInput label="Логін" value={username} onChangeText={setUsername} mode="outlined" style={styles.input} />
      <TextInput label="Пароль" value={password} onChangeText={setPassword} secureTextEntry mode="outlined" style={styles.input} />

      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Увійти
      </Button>

      <Text style={styles.hint}>
        Тестові акаунти:{'\n'}admin / 1234{'\n'}user / 1111
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { textAlign: 'center', marginBottom: 8, color: '#FF2D55', fontWeight: 'bold' },
  subtitle: { textAlign: 'center', marginBottom: 40, color: '#666' },
  input: { marginBottom: 16 },
  button: { marginTop: 20, paddingVertical: 8 },
  hint: { marginTop: 50, textAlign: 'center', color: '#888', lineHeight: 22 },
});