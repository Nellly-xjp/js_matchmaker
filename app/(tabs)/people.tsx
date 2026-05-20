import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export type JPUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  address: { city: string; street: string };
  company: { name: string };
};

// jsonplaceholder — повністю безкоштовний, без ключів
const fetchUsers = async (): Promise<JPUser[]> => {
  const res = await axios.get('https://jsonplaceholder.typicode.com/users');
  return res.data;
};

const AVATAR_COLORS = ['#FF2D55','#FF6B6B','#FF8C42','#F7B731','#26C281','#2980b9','#8e44ad','#e74c3c','#16a085','#2c3e50'];

export default function PeopleScreen() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const { data: users, isLoading, isError, error, dataUpdatedAt } = useQuery({
    queryKey: ['jp-users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['jp-users'] });
    setRefreshing(false);
  };

  const cacheTime = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null;

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF2D55" />
        <Text style={styles.loadingText}>Завантажуємо з API...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>Помилка: {(error as Error).message}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => queryClient.invalidateQueries({ queryKey: ['jp-users'] })}>
          <Text style={styles.retryText}>Спробувати знову</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Рядок кешу */}
      <View style={styles.cacheBar}>
        <Ionicons name="time-outline" size={14} color="#FF2D55" />
        <Text style={styles.cacheText}>
          jsonplaceholder.typicode.com{cacheTime ? ` • оновлено ${cacheTime}` : ''}
        </Text>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh" size={16} color="#FF2D55" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={users}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF2D55" />}
        renderItem={({ item }) => {
          const color = AVATAR_COLORS[(item.id - 1) % AVATAR_COLORS.length];
          const initials = item.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2);
          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.9}
              onPress={() => router.push({
                pathname: '/person/[id]',
                params: {
                  id: item.id,
                  name: item.name,
                  email: item.email,
                  phone: item.phone,
                  city: item.address.city,
                  company: item.company.name,
                  color,
                  initials,
                },
              })}
            >
              <View style={[styles.avatar, { backgroundColor: color }]}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.row}>
                  <Ionicons name="mail-outline" size={13} color="#FF2D55" />
                  <Text style={styles.sub}> {item.email}</Text>
                </View>
                <View style={styles.row}>
                  <Ionicons name="location-outline" size={13} color="#FF2D55" />
                  <Text style={styles.sub}> {item.address.city}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ddd" />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF5F7', padding: 24 },
  loadingText: { marginTop: 14, fontSize: 15, color: '#888' },
  errorIcon: { fontSize: 48, marginBottom: 12 },
  errorText: { fontSize: 15, color: '#555', textAlign: 'center', marginBottom: 20 },
  retryBtn: { backgroundColor: '#FF2D55', borderRadius: 14, paddingHorizontal: 24, paddingVertical: 12 },
  retryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  cacheBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF0F3', paddingHorizontal: 16, paddingVertical: 10, gap: 6 },
  cacheText: { flex: 1, fontSize: 12, color: '#FF2D55' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 18, padding: 14, shadowColor: '#FF2D55', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3 },
  avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 14, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  info: { flex: 1, gap: 3 },
  name: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  row: { flexDirection: 'row', alignItems: 'center' },
  sub: { fontSize: 12, color: '#888' },
});