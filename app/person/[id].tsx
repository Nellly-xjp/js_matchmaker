import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Alert, Platform, Linking,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as Calendar from 'expo-calendar';
import { Ionicons } from '@expo/vector-icons';

type UserDetail = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
};

// Завантаження детальної інформації з API
const fetchUserDetail = async (id: string): Promise<UserDetail> => {
  const res = await axios.get(`https://reqres.in/api/users/${id}`);
  return res.data.data;
};

export default function PersonDetailScreen() {
  const params = useLocalSearchParams<{ id: string; email: string; first_name: string; last_name: string; avatar: string }>();
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [calendarAdded, setCalendarAdded] = useState(false);

  // React Query — кешування деталей
  const { data: user, isLoading } = useQuery({
    queryKey: ['user-detail', params.id],
    queryFn: () => fetchUserDetail(params.id),
    placeholderData: {
      id: Number(params.id),
      email: params.email,
      first_name: params.first_name,
      last_name: params.last_name,
      avatar: params.avatar,
    },
    staleTime: 5 * 60 * 1000,
  });

  // ── Нативна можливість 1: прикріпити зображення ────────────
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

  const removeImage = () => {
    Alert.alert('Видалити зображення?', '', [
      { text: 'Скасувати', style: 'cancel' },
      { text: 'Видалити', style: 'destructive', onPress: () => setAttachedImage(null) },
    ]);
  };

  // ── Нативна можливість 2: додати нагадування в календар ────
  const addToCalendar = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Дозвіл відхилено', 'Потрібен доступ до календаря');
      return;
    }

    try {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const defaultCal = calendars.find(c => c.allowsModifications) ?? calendars[0];

      if (!defaultCal) {
        Alert.alert('Помилка', 'Не знайдено доступного календаря');
        return;
      }

      const start = new Date();
      start.setDate(start.getDate() + 1);
      start.setHours(12, 0, 0, 0);
      const end = new Date(start);
      end.setHours(12, 30, 0, 0);

      await Calendar.createEventAsync(defaultCal.id, {
        title: `Зустріч з ${user?.first_name} ${user?.last_name}`,
        startDate: start,
        endDate: end,
        notes: `Email: ${user?.email}\nID: ${user?.id}`,
        alarms: [{ relativeOffset: -30 }],
      });

      setCalendarAdded(true);
      Alert.alert('Додано в календар! 📅', `Нагадування на завтра о 12:00\nЗустріч з ${user?.first_name} ${user?.last_name}`);
    } catch (e) {
      Alert.alert('Помилка', 'Не вдалося додати в календар');
    }
  };

  const removeFromCalendar = () => {
    setCalendarAdded(false);
    Alert.alert('Нагадування видалено', 'Запис прибрано з календаря');
  };

  const fullName = `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Назад */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#FF2D55" />
        <Text style={styles.backText}>Назад</Text>
      </TouchableOpacity>

      {/* Аватар + ім'я */}
      <View style={styles.heroSection}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: user?.avatar }} style={styles.avatar} />
          {isLoading && <View style={styles.avatarOverlay} />}
        </View>
        <Text style={styles.name}>{fullName}</Text>
        <View style={styles.emailRow}>
          <Ionicons name="mail" size={16} color="#FF2D55" />
          <Text style={styles.email}> {user?.email}</Text>
        </View>
        <View style={styles.idBadge}>
          <Text style={styles.idText}>reqres.in • ID: {user?.id}</Text>
        </View>
      </View>

      {/* Інформація */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Детальна інформація</Text>
        <View style={styles.infoCard}>
          <InfoRow icon="person" label="Імʼя" value={user?.first_name ?? '—'} />
          <InfoRow icon="person-outline" label="Прізвище" value={user?.last_name ?? '—'} />
          <InfoRow icon="mail-outline" label="Email" value={user?.email ?? '—'} />
          <InfoRow icon="key-outline" label="ID" value={String(user?.id ?? '—')} last />
        </View>
      </View>

      {/* Нативна 2: Календар */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 Нагадування в календар</Text>
        <View style={styles.nativeCard}>
          <Text style={styles.nativeDesc}>
            {calendarAdded
              ? `Нагадування встановлено: "Зустріч з ${user?.first_name}" — завтра о 12:00`
              : 'Додайте нагадування про перегляд цього профілю'}
          </Text>
          {!calendarAdded ? (
            <TouchableOpacity style={styles.nativeBtn} onPress={addToCalendar}>
              <Ionicons name="calendar" size={18} color="#fff" />
              <Text style={styles.nativeBtnText}>Додати в календар</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.nativeBtnRow}>
              <TouchableOpacity style={[styles.nativeBtn, { flex: 1, backgroundColor: '#22C55E' }]} disabled>
                <Ionicons name="checkmark-circle" size={18} color="#fff" />
                <Text style={styles.nativeBtnText}>Додано ✓</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.nativeBtn, { backgroundColor: '#EF4444' }]} onPress={removeFromCalendar}>
                <Ionicons name="trash-outline" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Нативна 1: Фото */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🖼 Прикріплене зображення</Text>
        <View style={styles.nativeCard}>
          {attachedImage ? (
            <>
              <Image source={{ uri: attachedImage }} style={styles.attachedImage} />
              <View style={styles.nativeBtnRow}>
                <TouchableOpacity style={[styles.nativeBtn, { flex: 1 }]} onPress={pickImage}>
                  <Ionicons name="image" size={18} color="#fff" />
                  <Text style={styles.nativeBtnText}>Змінити</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.nativeBtn, { backgroundColor: '#EF4444' }]} onPress={removeImage}>
                  <Ionicons name="trash-outline" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.nativeDesc}>Прикріпіть фото до цього профілю</Text>
              <TouchableOpacity style={styles.nativeBtn} onPress={pickImage}>
                <Ionicons name="image" size={18} color="#fff" />
                <Text style={styles.nativeBtnText}>Вибрати з галереї</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

function InfoRow({ icon, label, value, last }: { icon: string; label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.infoRow, !last && styles.infoRowBorder]}>
      <View style={styles.infoLeft}>
        <Ionicons name={icon as any} size={16} color="#FF2D55" />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  backBtn: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 6 },
  backText: { fontSize: 16, color: '#FF2D55', fontWeight: '600' },
  heroSection: { alignItems: 'center', paddingBottom: 24, paddingHorizontal: 24 },
  avatarWrapper: { position: 'relative', marginBottom: 16 },
  avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 4, borderColor: '#FF2D55' },
  avatarOverlay: { ...StyleSheet.absoluteFillObject, borderRadius: 55, backgroundColor: 'rgba(255,255,255,0.4)' },
  name: { fontSize: 26, fontWeight: '900', color: '#1a1a1a', marginBottom: 6 },
  emailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  email: { fontSize: 15, color: '#888' },
  idBadge: { backgroundColor: '#FFF0F3', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 4 },
  idText: { fontSize: 12, color: '#FF2D55', fontWeight: '600' },
  section: { marginHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#333', marginBottom: 10 },
  infoCard: { backgroundColor: '#fff', borderRadius: 18, overflow: 'hidden', shadowColor: '#FF2D55', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13 },
  infoRowBorder: { borderBottomWidth: 0.5, borderBottomColor: '#FFE4EC' },
  infoLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoLabel: { fontSize: 14, color: '#888' },
  infoValue: { fontSize: 14, color: '#1a1a1a', fontWeight: '500', maxWidth: '60%', textAlign: 'right' },
  nativeCard: { backgroundColor: '#fff', borderRadius: 18, padding: 16, shadowColor: '#FF2D55', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, gap: 12 },
  nativeDesc: { fontSize: 14, color: '#888', lineHeight: 20 },
  nativeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF2D55', borderRadius: 14, paddingVertical: 12, paddingHorizontal: 20, gap: 8 },
  nativeBtnRow: { flexDirection: 'row', gap: 10 },
  nativeBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  attachedImage: { width: '100%', height: 200, borderRadius: 14 },
});
