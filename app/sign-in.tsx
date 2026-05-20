import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, ScrollView, ActivityIndicator,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useAuth } from './ctx/auth';
import { router } from 'expo-router';

export default function SignInScreen() {
  const [email, setEmail] = useState('eve.holt@reqres.in');
  const [password, setPassword] = useState('cityslicka');
  const [secure, setSecure] = useState(true);
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Помилка', 'Заповніть усі поля!');
      return;
    }
    const result = await login(email.trim(), password);
    if (result.ok) {
      router.replace('/(tabs)/profiles');
    } else {
      Alert.alert('Помилка входу', result.error ?? 'Невірні дані');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#FF2D55' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <Text style={styles.heartBig}>💝</Text>
          <Text style={styles.appName}>MatchMaker</Text>
          <Text style={styles.tagline}>Агентство знайомств{'\n'}з інтелектуальним підбором</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Вхід до акаунту</Text>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            outlineColor="#FFB6C1"
            activeOutlineColor="#FF2D55"
            keyboardType="email-address"
            autoCapitalize="none"
            left={<TextInput.Icon icon="email" color="#FF2D55" />}
          />

          <TextInput
            label="Пароль"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secure}
            mode="outlined"
            style={styles.input}
            outlineColor="#FFB6C1"
            activeOutlineColor="#FF2D55"
            left={<TextInput.Icon icon="lock" color="#FF2D55" />}
            right={<TextInput.Icon icon={secure ? 'eye' : 'eye-off'} onPress={() => setSecure(!secure)} color="#aaa" />}
          />

          <TouchableOpacity style={[styles.loginBtn, isLoading && { opacity: 0.7 }]} onPress={handleLogin} disabled={isLoading} activeOpacity={0.85}>
            {isLoading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.loginText}>Увійти ❤️</Text>
            }
          </TouchableOpacity>

          <View style={styles.apiNote}>
            <Text style={styles.apiTitle}>🌐 Авторизація через reqres.in API</Text>
            <Text style={styles.apiText}>eve.holt@reqres.in / cityslicka</Text>
            <Text style={styles.apiText}>george.bluth@reqres.in / pistol</Text>
            <View style={styles.divider} />
            <Text style={styles.apiTitle}>💻 Локальні акаунти</Text>
            <Text style={styles.apiText}>admin@matchmaker.com / 1234</Text>
            <Text style={styles.apiText}>user@matchmaker.com / 1111</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24, backgroundColor: '#FF2D55' },
  hero: { alignItems: 'center', marginBottom: 32 },
  heartBig: { fontSize: 72, marginBottom: 8 },
  appName: { fontSize: 42, fontWeight: '900', color: '#fff', letterSpacing: 2 },
  tagline: { fontSize: 15, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: 6, lineHeight: 22 },
  card: { backgroundColor: '#fff', borderRadius: 28, padding: 28, elevation: 10 },
  cardTitle: { fontSize: 22, fontWeight: '800', color: '#222', textAlign: 'center', marginBottom: 24 },
  input: { marginBottom: 14, backgroundColor: '#fff' },
  loginBtn: { marginTop: 8, borderRadius: 16, backgroundColor: '#FF2D55', paddingVertical: 16, alignItems: 'center' },
  loginText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  apiNote: { marginTop: 22, backgroundColor: '#FFF0F3', borderRadius: 12, padding: 14 },
  apiTitle: { fontSize: 12, fontWeight: '700', color: '#FF2D55', marginBottom: 4 },
  apiText: { fontSize: 12, color: '#555', marginBottom: 2 },
  divider: { height: 0.5, backgroundColor: '#FFB6C1', marginVertical: 10 },
});