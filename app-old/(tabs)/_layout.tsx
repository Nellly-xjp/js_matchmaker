import { Stack } from 'expo-router';
import { ThemeProvider } from '@react-navigation/native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import 'react-native-reanimated';

export const unstable_settings = { anchor: 'index' };

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
       
      </Stack>
    </ThemeProvider>
  );
}