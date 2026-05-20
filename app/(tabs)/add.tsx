import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert,
  TouchableOpacity, Switch,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useProfiles } from '../ctx/profiles';
import { ALL_INTERESTS, Interest, Gender, LookingFor, Profile } from '../../data/store';
import { Ionicons } from '@expo/vector-icons';

const INTEREST_ICONS: Record<Interest, string> = {
  'Подорожі': '✈️', 'Спорт': '⚽', 'Кіно': '🎬', 'Музика': '🎵',
  'Кулінарія': '🍳', 'Читання': '📚', 'Природа': '🌿',
  'Мистецтво': '🎨', 'Технології': '💻', 'Танці': '💃',
};

const PHOTOS_MALE = [
  'https://picsum.photos/id/338/400/500',
  'https://picsum.photos/id/64/400/500',
  'https://picsum.photos/id/201/400/500',
  'https://picsum.photos/id/433/400/500',
];
const PHOTOS_FEMALE = [
  'https://picsum.photos/id/1011/400/500',
  'https://picsum.photos/id/1027/400/500',
  'https://picsum.photos/id/102/400/500',
  'https://picsum.photos/id/1066/400/500',
];

export default function AddScreen() {
  const { addProfile, setMyProfile } = useProfiles();
  const [name, setName] = useState('');
  const [age, setAge] = useState(25);
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState<Gender>('Жінка');
  const [lookingFor, setLookingFor] = useState<LookingFor>('Чоловіка');
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [isMyProfile, setIsMyProfile] = useState(false);

  const toggleInterest = (i: Interest) => {
    setSelectedInterests(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    );
  };

  const handleAdd = () => {
    if (!name.trim() || !city.trim()) {
      Alert.alert('Помилка', 'Заповніть імʼя та місто!');
      return;
    }
    if (selectedInterests.length === 0) {
      Alert.alert('Помилка', 'Оберіть хоча б один інтерес!');
      return;
    }

    const photos = gender === 'Чоловік' ? PHOTOS_MALE : PHOTOS_FEMALE;
    const photo = photos[Math.floor(Math.random() * photos.length)];

    const newProfile: Profile = {
      id: Date.now().toString(),
      name: name.trim(),
      age,
      city: city.trim(),
      bio: bio.trim(),
      photo,
      gender,
      lookingFor,
      interests: selectedInterests,
    };

    addProfile(newProfile);
    if (isMyProfile) setMyProfile(newProfile);

    Alert.alert('Готово! 🎉', isMyProfile
      ? `Профіль ${name} додано і встановлено як ваш! Перейдіть у "Мої пари" для підбору.`
      : `Профіль ${name} успішно додано!`
    );
    setName(''); setCity(''); setBio(''); setAge(25);
    setSelectedInterests([]); setIsMyProfile(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>✨ Новий профіль</Text>

      {/* Мій профіль toggle */}
      <View style={styles.myProfileRow}>
        <View>
          <Text style={styles.myProfileLabel}>Це мій профіль</Text>
          <Text style={styles.myProfileSub}>Для підбору пар за алгоритмом</Text>
        </View>
        <Switch value={isMyProfile} onValueChange={setIsMyProfile} thumbColor={isMyProfile ? '#FF2D55' : '#ccc'} trackColor={{ true: '#FFB6C1', false: '#eee' }} />
      </View>

      {/* Стать */}
      <Text style={styles.sectionLabel}>Стать</Text>
      <View style={styles.segmentRow}>
        {(['Жінка', 'Чоловік'] as Gender[]).map(g => (
          <TouchableOpacity key={g} style={[styles.segment, gender === g && styles.segmentActive]} onPress={() => setGender(g)}>
            <Text style={[styles.segmentText, gender === g && styles.segmentTextActive]}>
              {g === 'Жінка' ? '👩 Жінка' : '👨 Чоловік'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Шукаю */}
      <Text style={styles.sectionLabel}>Шукаю</Text>
      <View style={styles.segmentRow}>
        {(['Жінку', 'Чоловіка', 'Будь-кого'] as LookingFor[]).map(l => (
          <TouchableOpacity key={l} style={[styles.segment, lookingFor === l && styles.segmentActive]} onPress={() => setLookingFor(l)}>
            <Text style={[styles.segmentText, lookingFor === l && styles.segmentTextActive]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput label="Імʼя" value={name} onChangeText={setName} mode="outlined" style={styles.input} outlineColor="#FFB6C1" activeOutlineColor="#FF2D55" left={<TextInput.Icon icon="account" color="#FF2D55" />} />
      <TextInput label="Місто" value={city} onChangeText={setCity} mode="outlined" style={styles.input} outlineColor="#FFB6C1" activeOutlineColor="#FF2D55" left={<TextInput.Icon icon="map-marker" color="#FF2D55" />} />
      <TextInput label="Про себе" value={bio} onChangeText={setBio} mode="outlined" multiline numberOfLines={3} style={styles.input} outlineColor="#FFB6C1" activeOutlineColor="#FF2D55" />

      {/* Вік */}
      <View style={styles.ageRow}>
        <Text style={styles.ageLabel}>Вік:</Text>
        <View style={styles.ageControls}>
          <TouchableOpacity style={styles.ageBtn} onPress={() => setAge(a => Math.max(18, a - 1))}>
            <Ionicons name="remove" size={20} color="#FF2D55" />
          </TouchableOpacity>
          <Text style={styles.ageValue}>{age}</Text>
          <TouchableOpacity style={styles.ageBtn} onPress={() => setAge(a => Math.min(60, a + 1))}>
            <Ionicons name="add" size={20} color="#FF2D55" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Інтереси */}
      <Text style={styles.sectionLabel}>Інтереси ({selectedInterests.length} обрано)</Text>
      <View style={styles.interestsGrid}>
        {ALL_INTERESTS.map(i => {
          const active = selectedInterests.includes(i);
          return (
            <TouchableOpacity key={i} style={[styles.interestChip, active && styles.interestChipActive]} onPress={() => toggleInterest(i)}>
              <Text style={styles.interestChipText}>{INTEREST_ICONS[i]} {i}</Text>
              {active && <Ionicons name="checkmark-circle" size={14} color="#FF2D55" style={{ marginLeft: 4 }} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.addBtn} onPress={handleAdd} activeOpacity={0.85}>
        <Text style={styles.addBtnText}>➕ Додати профіль</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7', padding: 20 },
  title: { fontSize: 28, fontWeight: '900', color: '#FF2D55', textAlign: 'center', marginBottom: 24, marginTop: 4 },
  myProfileRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 20, shadowColor: '#FF2D55', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  myProfileLabel: { fontSize: 16, fontWeight: '700', color: '#333' },
  myProfileSub: { fontSize: 12, color: '#999', marginTop: 2 },
  sectionLabel: { fontSize: 15, fontWeight: '700', color: '#333', marginBottom: 10, marginTop: 4 },
  segmentRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  segment: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', borderWidth: 1.5, borderColor: '#FFB6C1' },
  segmentActive: { backgroundColor: '#FF2D55', borderColor: '#FF2D55' },
  segmentText: { fontSize: 13, fontWeight: '600', color: '#FF2D55' },
  segmentTextActive: { color: '#fff' },
  input: { marginBottom: 14, backgroundColor: '#fff' },
  ageRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 16 },
  ageLabel: { fontSize: 16, fontWeight: '600', color: '#333' },
  ageControls: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  ageBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFF0F3', alignItems: 'center', justifyContent: 'center' },
  ageValue: { fontSize: 22, fontWeight: '800', color: '#FF2D55', minWidth: 36, textAlign: 'center' },
  interestsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  interestChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#FFB6C1' },
  interestChipActive: { backgroundColor: '#FFF0F3', borderColor: '#FF2D55' },
  interestChipText: { fontSize: 13, color: '#333', fontWeight: '500' },
  addBtn: { backgroundColor: '#FF2D55', borderRadius: 16, paddingVertical: 16, alignItems: 'center', shadowColor: '#FF2D55', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  addBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
});
