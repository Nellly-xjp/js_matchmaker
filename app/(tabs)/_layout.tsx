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
        headerTitle: user ? `MatchMaker — ${user.name}` : 'MatchMaker',
        headerRight: () => (
          <Ionicons 
            name="log-out-outline" 
            size={26} 
            color="#FF2D55" 
            style={{ marginRight: 15 }}
            onPress={() => {
              Alert.alert('Вихід', 'Ви дійсно хочете вийти з акаунту?', [
                { text: 'Скасувати', style: 'cancel' },
                { text: 'Вийти', style: 'destructive', onPress: logout }
              ]);
            }}
          />
        ),
      }}
    >
      <Tabs.Screen 
        name="profiles" 
        options={{ 
          title: 'Профілі',
          tabBarIcon: ({ color }) => <Ionicons name="heart" size={24} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="add" 
        options={{ 
          title: 'Додати',
          tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={24} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="settings" 
        options={{ 
          title: 'Налаштування',
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />,
        }} 
      />
    </Tabs>
  );
}