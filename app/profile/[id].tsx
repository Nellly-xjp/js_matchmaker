import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Calendar from 'expo-calendar';
import { Ionicons } from '@expo/vector-icons';
import { Interest } from '../../data/store';

const INTEREST_ICONS: Record<Interest, string> = {
  'Подорожі': '✈️', 'Спорт': '⚽', 'Кіно': '🎬', 'Музика': '🎵',
  'Кулінарія': '🍳', 'Читання': '📚', 'Природа': '🌿',
  'Мистецтво': '🎨', 'Технології': '💻', 'Танці': '💃',
};

function CompatBadge({ score }: { score: number }) {
  const color = score >= 70 ? '#22C55E' : score >= 40 ? '#F59E0B' : '#EF4444';
  return (
    <View style={[styles.compatBadge, { backgroundColor: color }]}>
      <Text style={styles.compatText}>Сумісність: {score}%</Text>
    </View>
  );
}

export default function ProfileDetailScreen() {
  const params = useLocalSearchParams<{
    id: string; name: string; age: string; city: string;
    bio: string; photo: string; gender: string;
    lookingFor: string; interests: string; compatibility: string;
  }>();

  const interests: Interest[] = JSON.parse(params.interests ?? '[]');
  const compat = Number(params.compatibility);

  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [calendarAdded, setCalendarAdded] = useState(false);

  // ── Нативна 1: галерея ──────────────────────────────────────
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Дозвіл відхилено', 'Потрібен доступ до галереї');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setAttachedImage(result.assets[0].uri);
      Alert.alert('Готово!', 'Зображення прикріплено ✓');
    }
  };

  // ── Нативна 2: календар ─────────────────────────────────────
  const addToCalendar = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Дозвіл відхилено', 'Потрібен доступ до календаря');
      return;
    }
    try {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const cal = calendars.find(c => c.allowsModifications) ?? calendars[0];
      if (!cal) { Alert.alert('Помилка', 'Не знайдено доступного календаря'); return; }

      const start = new Date();
      start.setDate(start.getDate() + 1);
      start.setHours(18, 0, 0, 0);
      const end = new Date(start);
      end.setHours(18, 30, 0, 0);

      await Calendar.createEventAsync(cal.id, {
        title: `Переглянути профіль: ${params.name}`,
        startDate: start,
        endDate: end,
        notes: `${params.city} • ${params.age} р.\n${params.bio}`,
        alarms: [{ relativeOffset: -60 }],
      });
      setCalendarAdded(true);
      Alert.alert('Додано в календар! 📅', `Нагадування: завтра о 18:00\nПереглянути профіль ${params.name}`);
    } catch {
      Alert.alert('Помилка', 'Не вдалося додати в календар');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#FF2D55" />
        <Text style={styles.backText}>Назад</Text>
      </TouchableOpacity>

      {/* Фото + ім'я */}
      <View style={styles.hero}>
        <Image source={{ uri: params.photo }} style={styles.photo} />
        <Text style={styles.name}>{params.name}, {params.age}</Text>
        <View style={styles.cityRow}>
          <Ionicons name="location" size={16} color="#FF2D55" />
          <Text style={styles.city}> {params.city}</Text>
        </View>
        {compat >= 0 && <CompatBadge score={compat} />}
      </View>

      {/* Біо */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Про себе</Text>
        <View style={styles.card}>
          <Text style={styles.bio}>{params.bio || 'Немає опису'}</Text>
        </View>
      </View>

      {/* Деталі */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Деталі</Text>
        <View style={styles.card}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Стать</Text>
            <Text style={styles.detailValue}>{params.gender}</Text>
          </View>
          <View style={[styles.detailRow, styles.detailRowBorder]}>
            <Text style={styles.detailLabel}>Шукає</Text>
            <Text style={styles.detailValue}>{params.lookingFor}</Text>
          </View>
          <View style={[styles.detailRow, styles.detailRowBorder]}>
            <Text style={styles.detailLabel}>Місто</Text>
            <Text style={styles.detailValue}>{params.city}</Text>
          </View>
        </View>
      </View>

      {/* Інтереси */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Інтереси</Text>
        <View style={styles.interestsWrap}>
          {interests.map(i => (
            <View key={i} style={styles.interestChip}>
              <Text style={styles.interestText}>{INTEREST_ICONS[i]} {i}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Нативна: Календар */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 Нагадування</Text>
        <View style={styles.card}>
          <Text style={styles.nativeDesc}>
            {calendarAdded
              ? `✓ Нагадування встановлено — завтра о 18:00`
              : 'Додайте нагадування переглянути цей профіль'}
          </Text>
          {calendarAdded ? (
            <TouchableOpacity style={[styles.nativeBtn, { backgroundColor: '#EF4444', marginTop: 10 }]} onPress={() => setCalendarAdded(false)}>
              <Ionicons name="trash-outline" size={18} color="#fff" />
              <Text style={styles.nativeBtnText}>Видалити нагадування</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.nativeBtn, { marginTop: 10 }]} onPress={addToCalendar}>
              <Ionicons name="calendar" size={18} color="#fff" />
              <Text style={styles.nativeBtnText}>Додати в календар</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Нативна: Фото */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🖼 Прикріплене фото</Text>
        <View style={styles.card}>
          {attachedImage
            ? <>
                <Image source={{ uri: attachedImage }} style={styles.attachedImg} />
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                  <TouchableOpacity style={[styles.nativeBtn, { flex: 1 }]} onPress={pickImage}>
                    <Ionicons name="image" size={18} color="#fff" />
                    <Text style={styles.nativeBtnText}>Змінити</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.nativeBtn, { backgroundColor: '#EF4444' }]} onPress={() => setAttachedImage(null)}>
                    <Ionicons name="trash-outline" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              </>
            : <>
                <Text style={styles.nativeDesc}>Прикріпіть фото до цього профілю</Text>
                <TouchableOpacity style={[styles.nativeBtn, { marginTop: 10 }]} onPress={pickImage}>
                  <Ionicons name="image" size={18} color="#fff" />
                  <Text style={styles.nativeBtnText}>Вибрати з галереї</Text>
                </TouchableOpacity>
              </>
          }
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  backBtn: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 6 },
  backText: { fontSize: 16, color: '#FF2D55', fontWeight: '600' },
  hero: { alignItems: 'center', paddingBottom: 24, paddingHorizontal: 24 },
  photo: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#FF2D55', marginBottom: 14 },
  name: { fontSize: 26, fontWeight: '900', color: '#1a1a1a', marginBottom: 6 },
  cityRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  city: { fontSize: 15, color: '#888' },
  compatBadge: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 6 },
  compatText: { fontSize: 14, color: '#fff', fontWeight: '800' },
  section: { marginHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#333', marginBottom: 10 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 16, shadowColor: '#FF2D55', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  bio: { fontSize: 15, color: '#444', lineHeight: 22 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  detailRowBorder: { borderTopWidth: 0.5, borderTopColor: '#FFE4EC' },
  detailLabel: { fontSize: 14, color: '#888' },
  detailValue: { fontSize: 14, color: '#1a1a1a', fontWeight: '600' },
  interestsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  interestChip: { backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1.5, borderColor: '#FFB6C1' },
  interestText: { fontSize: 14, color: '#FF2D55', fontWeight: '600' },
  nativeDesc: { fontSize: 14, color: '#888', lineHeight: 20 },
  nativeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF2D55', borderRadius: 14, paddingVertical: 12, paddingHorizontal: 20, gap: 8 },
  nativeBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  attachedImg: { width: '100%', height: 200, borderRadius: 14 },
});
