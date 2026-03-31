import { Stack } from 'expo-router';
import { ThemeProvider } from '@react-navigation/native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import 'react-native-reanimated';
import { AuthProvider } from './ctx/auth';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="sign-in" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}