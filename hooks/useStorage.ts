import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from './useStore';

const KEYS = {
  user: 'matchme_user',
  settings: 'matchme_settings',
};

export async function loadFromStorage() {
  try {
    const settingsJson = await AsyncStorage.getItem(KEYS.settings);

    const store = useStore.getState();

    if (settingsJson) {
      const savedSettings = JSON.parse(settingsJson);
      store.updateSettings(savedSettings);
      console.log('✅ Налаштування завантажено з AsyncStorage');
    }
  } catch (e) {
    console.log('❌ Помилка читання з AsyncStorage:', e);
  }
}

export async function saveSettingsToStorage(settings: any) {
  try {
    const sessionOnly = useStore.getState().settings.sessionOnly;
    if (sessionOnly) {
      console.log('⏭ Сесійний режим — налаштування не зберігаються');
      return;
    }
    await AsyncStorage.setItem(KEYS.settings, JSON.stringify(settings));
    console.log('✅ Налаштування збережено в AsyncStorage');
  } catch (e) {
    console.log('❌ Помилка збереження налаштувань:', e);
  }
}

export async function saveUserToStorage(user: any) {
  try {
    const sessionOnly = useStore.getState().settings.sessionOnly;
    if (sessionOnly) {
      console.log('⏭ Сесійний режим — користувач не зберігається');
      return;
    }
    await AsyncStorage.setItem(KEYS.user, JSON.stringify(user));
    console.log('✅ Користувача збережено в AsyncStorage');
  } catch (e) {
    console.log('❌ Помилка збереження користувача:', e);
  }
}

export async function clearStorage() {
  try {
    await AsyncStorage.multiRemove([KEYS.user, KEYS.settings]);
    console.log('✅ AsyncStorage очищено');
  } catch (e) {
    console.log('❌ Помилка очищення сховища:', e);
  }
}