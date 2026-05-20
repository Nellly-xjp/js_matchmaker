import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, Alert, Modal, ScrollView, TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { useProfiles } from '../ctx/profiles';
import { getMatches, calcCompatibility, Interest, ALL_INTERESTS, Profile } from '../../data/store';
import { Ionicons } from '@expo/vector-icons';

const INTEREST_ICONS: Record<Interest, string> = {
  'Подорожі': '✈️', 'Спорт': '⚽', 'Кіно': '🎬', 'Музика': '🎵',
  'Кулінарія': '🍳', 'Читання': '📚', 'Природа': '🌿',
  'Мистецтво': '🎨', 'Технології': '💻', 'Танці': '💃',
};

function CompatBadge({ score }: { score: number }) {
  const color = score >= 70 ? '#22C55E' : score >= 40 ? '#F59E0B' : '#EF4444';
  return (
    <View style={[styles.compatBadge, { backgroundColor: color }]}>
      <Text style={styles.compatText}>{score}%</Text>
    </View>
  );
}

export default function ProfilesScreen() {
  const { profiles, deleteProfile, myProfile } = useProfiles();
  const [selectedProfile, setSelectedProfile] = useState<(Profile & { compatibility?: number }) | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterInterest, setFilterInterest] = useState<Interest | null>(null);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | 'matches'>('all');

  const displayProfiles = tab === 'matches' && myProfile
    ? getMatches(myProfile, profiles)
    : profiles
        .filter(p => myProfile ? p.id !== myProfile.id : true)
        .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase()))
        .filter(p => !filterInterest || p.interests.includes(filterInterest))
        .map(p => ({ ...p, compatibility: myProfile ? calcCompatibility(myProfile, p) : undefined }));

  const openProfile = (profile: typeof displayProfiles[0]) => {
    setSelectedProfile(profile);
    setModalVisible(true);
  };

  const handleDelete = () => {
    if (!selectedProfile) return;
    Alert.alert('Видалити профіль?', `Ви дійсно хочете видалити ${selectedProfile.name}?`, [
      { text: 'Скасувати', style: 'cancel' },
      { text: 'Видалити', style: 'destructive', onPress: () => { deleteProfile(selectedProfile.id); setModalVisible(false); } },
    ]);
  };

  // ─── Кнопка "Детальніше" → перехід на екран деталей ────────
  const openDetails = () => {
    if (!selectedProfile) return;
    setModalVisible(false);
    router.push({
      pathname: '/profile/[id]',
      params: {
        id: selectedProfile.id,
        name: selectedProfile.name,
        age: selectedProfile.age,
        city: selectedProfile.city,
        bio: selectedProfile.bio,
        photo: selectedProfile.photo,
        gender: selectedProfile.gender,
        lookingFor: selectedProfile.lookingFor,
        interests: JSON.stringify(selectedProfile.interests),
        compatibility: selectedProfile.compatibility ?? -1,
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color="#aaa" style={styles.searchIcon} />
        <TextInput placeholder="Пошук за іменем або містом..." style={styles.searchInput} value={search} onChangeText={setSearch} placeholderTextColor="#bbb" />
        {search ? <TouchableOpacity onPress={() => setSearch('')}><Ionicons name="close-circle" size={18} color="#ccc" /></TouchableOpacity> : null}
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, tab === 'all' && styles.tabActive]} onPress={() => setTab('all')}>
          <Text style={[styles.tabText, tab === 'all' && styles.tabTextActive]}>Всі профілі</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'matches' && styles.tabActive]} onPress={() => setTab('matches')}>
          <Text style={[styles.tabText, tab === 'matches' && styles.tabTextActive]}>💝 Мої пари</Text>
        </TouchableOpacity>
      </View>

      {tab === 'all' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          <TouchableOpacity style={[styles.filterChip, !filterInterest && styles.filterChipActive]} onPress={() => setFilterInterest(null)}>
            <Text style={[styles.filterChipText, !filterInterest && styles.filterChipTextActive]}>Всі</Text>
          </TouchableOpacity>
          {ALL_INTERESTS.map(i => (
            <TouchableOpacity key={i} style={[styles.filterChip, filterInterest === i && styles.filterChipActive]} onPress={() => setFilterInterest(filterInterest === i ? null : i)}>
              <Text style={[styles.filterChipText, filterInterest === i && styles.filterChipTextActive]}>{INTEREST_ICONS[i]} {i}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <FlatList
        data={displayProfiles}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, gap: 14 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>
              {tab === 'matches' && !myProfile ? 'Спочатку заповніть свій профіль у вкладці "Додати"' : 'Нікого не знайдено'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openProfile(item)} activeOpacity={0.9}>
            <Image source={{ uri: item.photo }} style={styles.photo} />
            <View style={styles.info}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{item.name}, {item.age}</Text>
                {item.compatibility !== undefined && <CompatBadge score={item.compatibility} />}
              </View>
              <View style={styles.cityRow}>
                <Ionicons name="location" size={14} color="#FF2D55" />
                <Text style={styles.city}> {item.city}</Text>
              </View>
              <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text>
              <View style={styles.interestsRow}>
                {item.interests.slice(0, 3).map(int => (
                  <View key={int} style={styles.interestTag}>
                    <Text style={styles.interestTagText}>{INTEREST_ICONS[int as Interest]} {int}</Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Модалка з кнопкою "Детальніше" */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedProfile && (
                <>
                  <Image source={{ uri: selectedProfile.photo }} style={styles.modalPhoto} />

                  {selectedProfile.compatibility !== undefined && (
                    <View style={styles.modalCompatRow}>
                      <Text style={styles.modalCompatLabel}>Сумісність:</Text>
                      <CompatBadge score={selectedProfile.compatibility} />
                    </View>
                  )}

                  <Text style={styles.modalName}>{selectedProfile.name}, {selectedProfile.age}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 6 }}>
                    <Ionicons name="location" size={16} color="#FF2D55" />
                    <Text style={styles.modalCity}> {selectedProfile.city}</Text>
                  </View>
                  <Text style={styles.modalBio} numberOfLines={3}>{selectedProfile.bio}</Text>

                  <View style={styles.interestsWrap}>
                    {selectedProfile.interests.slice(0, 4).map(int => (
                      <View key={int} style={styles.interestTagLarge}>
                        <Text style={styles.interestTagLargeText}>{INTEREST_ICONS[int as Interest]} {int}</Text>
                      </View>
                    ))}
                  </View>

                  {/* ── Кнопка "Детальніше" (пункт 5) ── */}
                  <TouchableOpacity style={styles.detailBtn} onPress={openDetails}>
                    <Ionicons name="information-circle" size={20} color="#fff" />
                    <Text style={styles.detailBtnText}>Детальніше</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                    <Text style={styles.deleteBtnText}>🗑 Видалити профіль</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                    <Text style={styles.closeBtnText}>Закрити</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  searchRow: { flexDirection: 'row', alignItems: 'center', margin: 16, marginBottom: 8, backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8, elevation: 2 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: '#333' },
  tabs: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 8, backgroundColor: '#FFE4EC', borderRadius: 14, padding: 4 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: '#FF2D55' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#FF2D55' },
  tabTextActive: { color: '#fff' },
  filterRow: { marginBottom: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#FFB6C1' },
  filterChipActive: { backgroundColor: '#FF2D55', borderColor: '#FF2D55' },
  filterChipText: { fontSize: 13, color: '#FF2D55', fontWeight: '600' },
  filterChipTextActive: { color: '#fff' },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 20, padding: 14, shadowColor: '#FF2D55', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  photo: { width: 100, height: 130, borderRadius: 14 },
  info: { flex: 1, marginLeft: 14, justifyContent: 'space-between' },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 19, fontWeight: '700', color: '#1a1a1a' },
  compatBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  compatText: { fontSize: 12, color: '#fff', fontWeight: '800' },
  cityRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  city: { fontSize: 13, color: '#888' },
  bio: { fontSize: 13, color: '#555', marginTop: 4 },
  interestsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 },
  interestTag: { backgroundColor: '#FFF0F3', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3 },
  interestTagText: { fontSize: 11, color: '#FF2D55' },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 48 },
  emptyText: { marginTop: 12, fontSize: 15, color: '#aaa', textAlign: 'center', lineHeight: 22 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, maxHeight: '90%' },
  modalPhoto: { width: '100%', height: 240, borderRadius: 20, marginBottom: 14 },
  modalCompatRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 8 },
  modalCompatLabel: { fontSize: 15, color: '#666' },
  modalName: { fontSize: 26, fontWeight: '800', textAlign: 'center', color: '#1a1a1a' },
  modalCity: { fontSize: 16, color: '#888', marginBottom: 8 },
  modalBio: { fontSize: 15, textAlign: 'center', color: '#444', lineHeight: 22, marginBottom: 14 },
  interestsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16, justifyContent: 'center' },
  interestTagLarge: { backgroundColor: '#FFF0F3', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  interestTagLargeText: { fontSize: 14, color: '#FF2D55', fontWeight: '600' },
  detailBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF2D55', borderRadius: 14, padding: 14, marginBottom: 10, gap: 8 },
  detailBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  deleteBtn: { backgroundColor: '#FFF0F0', borderRadius: 14, padding: 14, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#FFCDD2' },
  deleteBtnText: { color: '#EF4444', fontWeight: '700', fontSize: 15 },
  closeBtn: { backgroundColor: '#F0F0F0', borderRadius: 14, padding: 14, alignItems: 'center' },
  closeBtnText: { color: '#555', fontWeight: '600', fontSize: 15 },
});
