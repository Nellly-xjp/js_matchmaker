import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { useAuth } from '../ctx/auth';
import { useProfiles } from '../ctx/profiles';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../hooks/useStore';
import { saveSettingsToStorage, clearStorage } from '../../hooks/useStorage';

const INTEREST_ICONS: Record<string, string> = {
  'Подорожі': '✈️', 'Спорт': '⚽', 'Кіно': '🎬', 'Музика': '🎵',
  'Кулінарія': '🍳', 'Читання': '📚', 'Природа': '🌿',
  'Мистецтво': '🎨', 'Технології': '💻', 'Танці': '💃',
};

const TEXTS = {
  uk: {
    settings: '⚙️ Налаштування',
    notifications: 'Сповіщення',
    distance: 'Показувати відстань',
    darkTheme: 'Темна тема',
    language: 'Мова',
    sessionOnly: 'Лише на поточну сесію',
    sessionHint: 'Налаштування не зберігатимуться',
    sessionWarning: 'Режим сесії увімкнено — зміни не збережуться після закриття',
    about: 'ℹ️ Про додаток',
    aboutText: 'Агентство знайомств з інтелектуальним підбором пари',
    version: 'Версія 2.0 • 2025',
    algo: '🧠 Алгоритм підбору враховує спільні інтереси, вік та місто',
    logout: 'Вийти з акаунту',
    logoutTitle: 'Вихід',
    logoutMsg: 'Ви дійсно хочете вийти?',
    cancel: 'Скасувати',
    stats: '📊 Статистика',
    profiles: 'Профілів',
    pairs: 'Потенційних пар',
    myProfile: '💝 Мій профіль для підбору',
  },
  en: {
    settings: '⚙️ Settings',
    notifications: 'Notifications',
    distance: 'Show distance',
    darkTheme: 'Dark theme',
    language: 'Language',
    sessionOnly: 'Current session only',
    sessionHint: 'Settings will not be saved',
    sessionWarning: 'Session mode on — changes will not be saved after closing',
    about: 'ℹ️ About',
    aboutText: 'Dating agency with intelligent matchmaking',
    version: 'Version 2.0 • 2025',
    algo: '🧠 Algorithm considers interests, age and city',
    logout: 'Log out',
    logoutTitle: 'Log out',
    logoutMsg: 'Are you sure you want to log out?',
    cancel: 'Cancel',
    stats: '📊 Statistics',
    profiles: 'Profiles',
    pairs: 'Potential pairs',
    myProfile: '💝 My matching profile',
  },
};

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { myProfile, profiles } = useProfiles();
  const settings = useStore((state) => state.settings);
  const updateSettings = useStore((state) => state.updateSettings);

  const t = TEXTS[settings.language];
  const isDark = settings.theme === 'dark';

  const bg = isDark ? '#1A1A1A' : '#FFF5F7';
  const cardBg = isDark ? '#2A2A2A' : '#fff';
  const textColor = isDark ? '#fff' : '#333';
  const subTextColor = isDark ? '#aaa' : '#888';
  const headerBg = isDark ? '#8B0000' : '#FF2D55';

  const handleToggle = async (key: 'notifications' | 'sessionOnly' | 'showDistance', value: boolean) => {
    const updated = { [key]: value };
    updateSettings(updated);
    await saveSettingsToStorage({ ...settings, ...updated });
  };

  const handleTheme = async (val: boolean) => {
    const theme = val ? 'dark' : 'light';
    updateSettings({ theme });
    await saveSettingsToStorage({ ...settings, theme });
  };

  const handleLanguage = async (language: 'uk' | 'en') => {
    updateSettings({ language });
    await saveSettingsToStorage({ ...settings, language });
  };

  const handleLogout = () => {
    Alert.alert(t.logoutTitle, t.logoutMsg, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.logout, style: 'destructive', onPress: async () => {
          await clearStorage();
          logout();
        }
      },
    ]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: bg }]} contentContainerStyle={{ paddingBottom: 40 }}>

      {/* Акаунт */}
      <View style={[styles.accountCard, { backgroundColor: headerBg }]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0) ?? '?'}</Text>
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userLogin}>@{user?.username}</Text>
      </View>

      {/* Мій профіль */}
      {myProfile && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>{t.myProfile}</Text>
          <View style={[styles.myProfileCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.myName, { color: textColor }]}>{myProfile.name}, {myProfile.age} • {myProfile.city}</Text>
            <Text style={[styles.myGender, { color: subTextColor }]}>👤 {myProfile.gender} • {myProfile.lookingFor}</Text>
            <View style={styles.interestsRow}>
              {myProfile.interests.map(i => (
                <View key={i} style={[styles.interestChip, { backgroundColor: isDark ? '#3A1A1A' : '#FFF0F3' }]}>
                  <Text style={styles.interestChipText}>{INTEREST_ICONS[i]} {i}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Статистика */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>{t.stats}</Text>
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: cardBg }]}>
            <Text style={styles.statNum}>{profiles.length}</Text>
            <Text style={[styles.statLabel, { color: subTextColor }]}>{t.profiles}</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: cardBg }]}>
            <Text style={styles.statNum}>{myProfile ? profiles.length - 1 : '—'}</Text>
            <Text style={[styles.statLabel, { color: subTextColor }]}>{t.pairs}</Text>
          </View>
        </View>
      </View>

      {/* Налаштування */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>{t.settings}</Text>

        <View style={[styles.settingRow, { backgroundColor: cardBg }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications" size={22} color="#FF2D55" />
            <Text style={[styles.settingText, { color: textColor }]}>{t.notifications}</Text>
          </View>
          <Switch
            value={settings.notifications}
            onValueChange={(val) => handleToggle('notifications', val)}
            trackColor={{ false: '#ddd', true: '#FF2D55' }}
            thumbColor="#fff"
          />
        </View>

        <View style={[styles.settingRow, { backgroundColor: cardBg }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="location" size={22} color="#FF2D55" />
            <Text style={[styles.settingText, { color: textColor }]}>{t.distance}</Text>
          </View>
          <Switch
            value={settings.showDistance}
            onValueChange={(val) => handleToggle('showDistance', val)}
            trackColor={{ false: '#ddd', true: '#FF2D55' }}
            thumbColor="#fff"
          />
        </View>

        <View style={[styles.settingRow, { backgroundColor: cardBg }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="moon" size={22} color="#FF2D55" />
            <Text style={[styles.settingText, { color: textColor }]}>{t.darkTheme}</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={handleTheme}
            trackColor={{ false: '#ddd', true: '#FF2D55' }}
            thumbColor="#fff"
          />
        </View>

        <View style={[styles.settingRow, { backgroundColor: cardBg }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="language" size={22} color="#FF2D55" />
            <Text style={[styles.settingText, { color: textColor }]}>{t.language}</Text>
          </View>
          <View style={styles.langRow}>
            <TouchableOpacity
              style={[styles.langBtn, settings.language === 'uk' && styles.langBtnActive]}
              onPress={() => handleLanguage('uk')}
            >
              <Text style={[styles.langText, settings.language === 'uk' && styles.langTextActive]}>УКР</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.langBtn, settings.language === 'en' && styles.langBtnActive]}
              onPress={() => handleLanguage('en')}
            >
              <Text style={[styles.langText, settings.language === 'en' && styles.langTextActive]}>ENG</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.settingRow, styles.sessionRow, { backgroundColor: cardBg }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="timer-outline" size={22} color="#FF9500" />
            <View>
              <Text style={[styles.settingText, { color: textColor }]}>{t.sessionOnly}</Text>
              <Text style={styles.settingHint}>{t.sessionHint}</Text>
            </View>
          </View>
          <Switch
            value={settings.sessionOnly}
            onValueChange={(val) => handleToggle('sessionOnly', val)}
            trackColor={{ false: '#ddd', true: '#FF9500' }}
            thumbColor="#fff"
          />
        </View>

        {settings.sessionOnly && (
          <View style={styles.sessionWarning}>
            <Ionicons name="warning-outline" size={16} color="#FF9500" />
            <Text style={styles.sessionWarningText}>{t.sessionWarning}</Text>
          </View>
        )}
      </View>

      {/* Про додаток */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>{t.about}</Text>
        <View style={[styles.aboutCard, { backgroundColor: cardBg }]}>
          <Text style={styles.aboutTitle}>💝 MatchMaker</Text>
          <Text style={[styles.aboutText, { color: subTextColor }]}>{t.aboutText}</Text>
          <Text style={[styles.aboutVersion, { color: subTextColor }]}>{t.version}</Text>
          <Text style={[styles.aboutAlgo, { color: subTextColor }]}>{t.algo}</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: headerBg }]} onPress={handleLogout}>
        <Ionicons name="log-out" size={20} color="#fff" />
        <Text style={styles.logoutText}>{t.logout}</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  accountCard: { alignItems: 'center', paddingTop: 30, paddingBottom: 30, marginBottom: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)' },
  avatarText: { fontSize: 36, color: '#fff', fontWeight: '900' },
  userName: { fontSize: 22, fontWeight: '800', color: '#fff' },
  userLogin: { fontSize: 15, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  section: { marginHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '800', marginBottom: 10 },
  myProfileCard: { borderRadius: 16, padding: 16, shadowColor: '#FF2D55', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  myName: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  myGender: { fontSize: 13, marginBottom: 10 },
  interestsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  interestChip: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  interestChipText: { fontSize: 12, color: '#FF2D55', fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: 12 },
  statBox: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: '#FF2D55', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  statNum: { fontSize: 32, fontWeight: '900', color: '#FF2D55' },
  statLabel: { fontSize: 13, marginTop: 2 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 14, padding: 16, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  sessionRow: { borderWidth: 1.5, borderColor: '#FF950033' },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  settingText: { fontSize: 15, fontWeight: '500' },
  settingHint: { fontSize: 11, color: '#aaa', marginTop: 2 },
  langRow: { flexDirection: 'row', gap: 6 },
  langBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#f0f0f0' },
  langBtnActive: { backgroundColor: '#FF2D55' },
  langText: { fontSize: 13, fontWeight: '700', color: '#888' },
  langTextActive: { color: '#fff' },
  sessionWarning: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFF8EE', borderRadius: 10, padding: 12, marginTop: -4, marginBottom: 8 },
  sessionWarningText: { fontSize: 13, color: '#FF9500', flex: 1 },
  aboutCard: { borderRadius: 16, padding: 18, alignItems: 'center', shadowColor: '#FF2D55', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  aboutTitle: { fontSize: 22, fontWeight: '900', color: '#FF2D55', marginBottom: 6 },
  aboutText: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 8 },
  aboutVersion: { fontSize: 12, marginBottom: 12 },
  aboutAlgo: { fontSize: 13, textAlign: 'center', lineHeight: 18, fontStyle: 'italic' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, borderRadius: 16, paddingVertical: 16, gap: 8, marginTop: 8 },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});