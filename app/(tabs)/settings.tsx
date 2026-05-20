import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuth } from '../ctx/auth';
import { useProfiles } from '../ctx/profiles';
import { Ionicons } from '@expo/vector-icons';

const INTEREST_ICONS: Record<string, string> = {
  'Подорожі': '✈️', 'Спорт': '⚽', 'Кіно': '🎬', 'Музика': '🎵',
  'Кулінарія': '🍳', 'Читання': '📚', 'Природа': '🌿',
  'Мистецтво': '🎨', 'Технології': '💻', 'Танці': '💃',
};

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { myProfile, profiles } = useProfiles();
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    Alert.alert('Вихід', 'Ви дійсно хочете вийти?', [
      { text: 'Скасувати', style: 'cancel' },
      { text: 'Вийти', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Аватар/акаунт */}
      <View style={styles.accountCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0) ?? '?'}</Text>
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userLogin}>@{user?.username}</Text>
      </View>

      {/* Мій профіль для підбору */}
      {myProfile && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💝 Мій профіль для підбору</Text>
          <View style={styles.myProfileCard}>
            <Text style={styles.myName}>{myProfile.name}, {myProfile.age} • {myProfile.city}</Text>
            <Text style={styles.myGender}>👤 {myProfile.gender} • Шукає: {myProfile.lookingFor}</Text>
            <View style={styles.interestsRow}>
              {myProfile.interests.map(i => (
                <View key={i} style={styles.interestChip}>
                  <Text style={styles.interestChipText}>{INTEREST_ICONS[i]} {i}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Статистика */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Статистика</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{profiles.length}</Text>
            <Text style={styles.statLabel}>Профілів</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{myProfile ? profiles.length - 1 : '—'}</Text>
            <Text style={styles.statLabel}>Потенційних пар</Text>
          </View>
        </View>
      </View>

      {/* Налаштування */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Налаштування</Text>

        <TouchableOpacity style={styles.settingRow} onPress={() => setNotifications(!notifications)}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications" size={22} color="#FF2D55" />
            <Text style={styles.settingText}>Сповіщення</Text>
          </View>
          <View style={[styles.toggle, notifications && styles.toggleActive]}>
            <Text style={{ color: notifications ? '#fff' : '#999', fontSize: 12, fontWeight: '700' }}>
              {notifications ? 'ВКЛ' : 'ВИКЛ'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Про додаток */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ Про додаток</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>💝 MatchMaker</Text>
          <Text style={styles.aboutText}>Агентство знайомств з інтелектуальним підбором пари</Text>
          <Text style={styles.aboutVersion}>Версія 2.0 • 2025</Text>
          <Text style={styles.aboutAlgo}>🧠 Алгоритм підбору враховує спільні інтереси, вік та місто проживання</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out" size={20} color="#fff" />
        <Text style={styles.logoutText}>Вийти з акаунту</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  accountCard: { alignItems: 'center', backgroundColor: '#FF2D55', paddingTop: 30, paddingBottom: 30, marginBottom: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)' },
  avatarText: { fontSize: 36, color: '#fff', fontWeight: '900' },
  userName: { fontSize: 22, fontWeight: '800', color: '#fff' },
  userLogin: { fontSize: 15, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  section: { marginHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#333', marginBottom: 10 },
  myProfileCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, shadowColor: '#FF2D55', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  myName: { fontSize: 17, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  myGender: { fontSize: 13, color: '#888', marginBottom: 10 },
  interestsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  interestChip: { backgroundColor: '#FFF0F3', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  interestChipText: { fontSize: 12, color: '#FF2D55', fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: 12 },
  statBox: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: '#FF2D55', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  statNum: { fontSize: 32, fontWeight: '900', color: '#FF2D55' },
  statLabel: { fontSize: 13, color: '#888', marginTop: 2 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingText: { fontSize: 15, color: '#333', fontWeight: '500' },
  toggle: { backgroundColor: '#eee', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  toggleActive: { backgroundColor: '#FF2D55' },
  aboutCard: { backgroundColor: '#fff', borderRadius: 16, padding: 18, alignItems: 'center', shadowColor: '#FF2D55', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  aboutTitle: { fontSize: 22, fontWeight: '900', color: '#FF2D55', marginBottom: 6 },
  aboutText: { fontSize: 14, color: '#555', textAlign: 'center', lineHeight: 20, marginBottom: 8 },
  aboutVersion: { fontSize: 12, color: '#bbb', marginBottom: 12 },
  aboutAlgo: { fontSize: 13, color: '#888', textAlign: 'center', lineHeight: 18, fontStyle: 'italic' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF2D55', marginHorizontal: 16, borderRadius: 16, paddingVertical: 16, gap: 8, marginTop: 8 },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
