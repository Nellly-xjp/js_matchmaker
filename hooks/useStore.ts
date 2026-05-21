import { create } from 'zustand';

export interface AppSettings {
  theme: 'light' | 'dark';
  language: 'uk' | 'en';
  notifications: boolean;
  showDistance: boolean;
  sessionOnly: boolean;
}

interface AppStore {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: AppSettings = {
  theme: 'light',
  language: 'uk',
  notifications: true,
  showDistance: true,
  sessionOnly: false,
};

export const useStore = create<AppStore>((set) => ({
  settings: defaultSettings,

  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),

  resetSettings: () =>
    set({ settings: defaultSettings }),
}));