import { Tabs } from 'expo-router';
import { useAuth } from '../ctx/auth';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';

export default function TabLayout() {
  const { user, logout } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#FF2D55' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '800', fontSize: 18 },
        headerTitle: 'MatchMaker ❤️',
        headerRight: () => (
          <Ionicons
            name="log-out-outline"
            size={26}
            color="#fff"
            style={{ marginRight: 15 }}
            onPress={() =>
              Alert.alert('Вихід', 'Ви дійсно хочете вийти?', [
                { text: 'Скасувати', style: 'cancel' },
                { text: 'Вийти', style: 'destructive', onPress: logout },
              ])
            }
          />
        ),
        tabBarActiveTintColor: '#FF2D55',
        tabBarInactiveTintColor: '#bbb',
        tabBarStyle: { borderTopColor: '#FFE4EC', backgroundColor: '#fff', paddingBottom: 4, height: 58 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="profiles"
        options={{ title: 'Профілі', tabBarIcon: ({ color, size }) => <Ionicons name="heart" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="people"
        options={{ title: 'Люди (API)', tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="add"
        options={{ title: 'Додати', tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: 'Налаштування', tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} /> }}
      />
    </Tabs>
  );
}
