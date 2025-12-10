import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { logoutLocal } from '../api/auth';

interface User {
  id: string;
  username: string;
  balance: number;
  createdAt: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setUser(null);
        return;
      }

      const me = await apiFetch<User>('/me');
      setUser(me);
    } catch (err) {
      console.error('Error al cargar /me:', err);
      setUser(null);
    }
  };

  const logout = () => {
    logoutLocal();
    setUser(null);
  };

  useEffect(() => {
    (async () => {
      await refreshUser();
      setLoading(false);
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
