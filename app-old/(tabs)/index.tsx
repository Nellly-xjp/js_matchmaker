import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ParallaxScrollView from '@/components/parallax-scroll-view';

type Profile = {
  id: string;
  name: string;
  age: number;
  city: string;
  photo: string;
  bio: string;
};

const ProfileCard = ({ profile }: { profile: Profile }) => {
  return (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: profile.photo }} style={styles.photo} />
      <View style={styles.info}>
        <ThemedText type="subtitle" style={styles.name}>
          {profile.name}, {profile.age}
        </ThemedText>
        <ThemedText style={styles.city}>{profile.city}</ThemedText>
        <ThemedText style={styles.bio} numberOfLines={2}>
          {profile.bio}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
};

const profiles: Profile[] = Array.from({ length: 25 }, (_, i) => ({
  id: String(i + 1),
  name: ['Анна', 'Олександр', 'Марія', 'Дмитро', 'Софія', 'Іван', 'Катерина', 'Максим'][i % 8],
  age: 19 + (i % 18),
  city: ['Київ', 'Львів', 'Одеса', 'Харків', 'Дніпро', 'Солотвино', 'Івано-Франківськ'][i % 7],
  photo: `https://picsum.photos/id/${80 + i}/400/500`,
  bio: 'Шукаю щирі стосунки, спільні подорожі та довгі вечірні розмови ❤️',
}));

export default function ProfilesScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FF2D55', dark: '#C41E3A' }}
      headerImage={
        <ThemedText type="title" style={{ color: '#FFF', fontSize: 48, textAlign: 'center', marginTop: 80 }}>
          ❤️ MatchMe
        </ThemedText>
      }>
      
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Знайди свою пару</ThemedText>
      </ThemedView>

      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProfileCard profile={item} />}
        scrollEnabled={false}
        contentContainerStyle={styles.list}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  photo: {
    width: 110,
    height: 150,
    borderRadius: 16,
  },
  info: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
  },
  city: {
    fontSize: 16,
    color: '#666',
    marginVertical: 4,
  },
  bio: {
    fontSize: 14,
    color: '#444',
    lineHeight: 18,
  },
});