import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

type User = { username: string; name: string; token: string };

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USERS: Record<string, { password: string; name: string }> = {
  'eve.holt@reqres.in':     { password: 'cityslicka', name: 'Eve Holt' },
  'george.bluth@reqres.in': { password: 'pistol',     name: 'George Bluth' },
  'admin@matchmaker.com':   { password: '1234',        name: 'Адміністратор' },
  'user@matchmaker.com':    { password: '1111',        name: 'Тестовий Користувач' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://reqres.in/api/login',
        { email, password },
        {
          headers: { 'x-api-key': 'reqres-free-v1' },
          timeout: 5000,
        }
      );
      const token = response.data.token as string;
      const name = LOCAL_USERS[email]?.name ?? email.split('@')[0];
      setUser({ username: email, name, token });
      return { ok: true };
    } catch (err: any) {
      const local = LOCAL_USERS[email];
      if (local && local.password === password) {
        setUser({ username: email, name: local.name, token: 'local-token' });
        return { ok: true };
      }
      const msg = err?.response?.data?.error ?? 'Невірний email або пароль';
      return { ok: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};