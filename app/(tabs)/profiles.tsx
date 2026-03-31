import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { Modal } from 'react-native';
import { useAuth } from '../ctx/auth';

type Profile = {
  id: string;
  name: string;
  age: number;
  city: string;
  bio: string;
  photo: string;
};

export default function ProfilesScreen() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([
    { id: '1', name: 'Анна', age: 24, city: 'Київ', bio: 'Люблю подорожі та каву ☕', photo: 'https://picsum.photos/id/1011/400/500' },
    { id: '2', name: 'Олександр', age: 27, city: 'Львів', bio: 'Шукаю щиру дівчину', photo: 'https://picsum.photos/id/64/400/500' },
    { id: '3', name: 'Марія', age: 22, city: 'Одеса', bio: 'Мрію про велике кохання ❤️', photo: 'https://picsum.photos/id/1027/400/500' },
    { id: '4', name: 'Дмитро', age: 29, city: 'Харків', bio: 'Займаюсь спортом і люблю природу', photo: 'https://picsum.photos/id/201/400/500' },
    { id: '5', name: 'Софія', age: 23, city: 'Солотвино', bio: 'Люблю гори та тихі вечори', photo: 'https://picsum.photos/id/102/400/500' },
  ]);

  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openProfile = (profile: Profile) => {
    setSelectedProfile(profile);
    setModalVisible(true);
  };

  const deleteProfile = () => {
    if (selectedProfile) {
      setProfiles(profiles.filter(p => p.id !== selectedProfile.id));
      setModalVisible(false);
      Alert.alert('Видалено', 'Профіль успішно видалено');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Знайди свою пару ❤️</Text>
      
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openProfile(item)}>
            <Image source={{ uri: item.photo }} style={styles.photo} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}, {item.age}</Text>
              <Text style={styles.city}>{item.city}</Text>
              <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedProfile && (
              <>
                <Image source={{ uri: selectedProfile.photo }} style={styles.modalPhoto} />
                <Text style={styles.modalName}>{selectedProfile.name}, {selectedProfile.age}</Text>
                <Text style={styles.modalCity}>{selectedProfile.city}</Text>
                <Text style={styles.modalBio}>{selectedProfile.bio}</Text>

                <TouchableOpacity style={styles.deleteButton} onPress={deleteProfile}>
                  <Text style={styles.deleteText}>Видалити профіль</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeText}>Закрити</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f8f8' },
  header: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#FF2D55' },
  card: { flexDirection: 'row', backgroundColor: '#fff', marginBottom: 12, borderRadius: 16, padding: 12, elevation: 3 },
  photo: { width: 110, height: 140, borderRadius: 12 },
  info: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  name: { fontSize: 20, fontWeight: '600' },
  city: { fontSize: 16, color: '#666', marginVertical: 4 },
  bio: { fontSize: 14, color: '#444' },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
  modalContent: { margin: 20, backgroundColor: 'white', borderRadius: 20, padding: 20 },
  modalPhoto: { width: '100%', height: 320, borderRadius: 16, marginBottom: 15 },
  modalName: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  modalCity: { fontSize: 18, textAlign: 'center', color: '#666', marginBottom: 10 },
  modalBio: { fontSize: 16, textAlign: 'center', marginBottom: 25 },
  deleteButton: { backgroundColor: '#FF4444', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  deleteText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  closeButton: { backgroundColor: '#ddd', padding: 14, borderRadius: 12, alignItems: 'center' },
  closeText: { fontWeight: '600', fontSize: 16 },
});