import { Stack } from 'expo-router';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import 'react-native-reanimated';
import { AuthProvider } from './ctx/auth';
import { ProfilesProvider } from './ctx/profiles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// React Query клієнт з кешуванням
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 хв кеш
      gcTime: 10 * 60 * 1000,     // 10 хв у пам'яті
      retry: 2,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProfilesProvider>
          <ThemeProvider value={DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="sign-in" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="profile/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="person/[id]" options={{ headerShown: false }} />
            </Stack>
          </ThemeProvider>
        </ProfilesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
