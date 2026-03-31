import React, { createContext, useContext, useState, ReactNode } from 'react';

type User = { username: string; name: string };

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const users = {
  admin: { password: '1234', name: 'Корнелія Аттілівна' },
  user:  { password: '1111', name: 'Тестовий Користувач' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    const u = users[username as keyof typeof users];
    if (u && u.password === password) {
      setUser({ username, name: u.name });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};