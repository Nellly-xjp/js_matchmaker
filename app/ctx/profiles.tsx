import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profile, INITIAL_PROFILES } from '../../data/store';

type ProfilesContextType = {
  profiles: Profile[];
  addProfile: (p: Profile) => void;
  deleteProfile: (id: string) => void;
  myProfile: Profile | null;
  setMyProfile: (p: Profile) => void;
};

const ProfilesContext = createContext<ProfilesContextType | undefined>(undefined);

const STORAGE_KEY = 'mm_profiles_v2';
const MY_PROFILE_KEY = 'mm_my_profile_v2';

export function ProfilesProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [myProfile, setMyProfileState] = useState<Profile | null>(null);

  // Завантаження з AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setProfiles(JSON.parse(saved));
        const savedMy = await AsyncStorage.getItem(MY_PROFILE_KEY);
        if (savedMy) setMyProfileState(JSON.parse(savedMy));
      } catch {}
    })();
  }, []);

  const saveProfiles = async (list: Profile[]) => {
    try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
  };

  const addProfile = (p: Profile) => {
    const updated = [...profiles, p];
    setProfiles(updated);
    saveProfiles(updated);
  };

  const deleteProfile = (id: string) => {
    const updated = profiles.filter(p => p.id !== id);
    setProfiles(updated);
    saveProfiles(updated);
  };

  const setMyProfile = async (p: Profile) => {
    setMyProfileState(p);
    try { await AsyncStorage.setItem(MY_PROFILE_KEY, JSON.stringify(p)); } catch {}
  };

  return (
    <ProfilesContext.Provider value={{ profiles, addProfile, deleteProfile, myProfile, setMyProfile }}>
      {children}
    </ProfilesContext.Provider>
  );
}

export const useProfiles = () => {
  const ctx = useContext(ProfilesContext);
  if (!ctx) throw new Error('useProfiles must be used within ProfilesProvider');
  return ctx;
};
