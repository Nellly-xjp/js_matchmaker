import React, { useState } from 'react';
import { StyleSheet, Switch, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ParallaxScrollView from '@/components/parallax-scroll-view';

export default function SettingsScreen() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);

  const toggleDarkTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    Alert.alert('Тема змінена', `Зараз увімкнено ${!isDarkTheme ? 'темну' : 'світлу'} тему`);
    // Тут пізніше можна додати реальну зміну теми через Context
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FF2D55', dark: '#C41E3A' }}
      headerImage={
        <ThemedText type="title" style={{ color: '#FFF', fontSize: 42, textAlign: 'center', marginTop: 100 }}>
          ⚙️
        </ThemedText>
      }>
      
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Налаштування</ThemedText>
      </ThemedView>

      <ThemedView style={styles.setting}>
        <ThemedText type="subtitle">Темна тема</ThemedText>
        <Switch value={isDarkTheme} onValueChange={toggleDarkTheme} />
      </ThemedView>

      <ThemedView style={styles.setting}>
        <ThemedText type="subtitle">Сповіщення</ThemedText>
        <Switch value={notifications} onValueChange={setNotifications} />
      </ThemedView>

      <ThemedView style={styles.setting}>
        <ThemedText type="subtitle">Геолокація</ThemedText>
        <Switch value={location} onValueChange={setLocation} />
      </ThemedView>

      <ThemedText style={styles.footer}>
        Агентство знайомств MatchMe © 2026{'\n'}
        Версія 1.0 • Курсовий проєкт
      </ThemedText>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    marginBottom: 12,
    borderRadius: 16,
  },
  footer: {
    textAlign: 'center',
    marginTop: 50,
    opacity: 0.6,
    lineHeight: 20,
  },
});