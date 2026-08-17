import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authAPI, getAccessToken, setTokens, clearTokens } from '@/services/api';
import type { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null, loading: true, isAdmin: false,
  login: async () => {}, register: async () => {}, logout: async () => {},
  refreshUser: async () => {}, updateUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) { setLoading(false); return; }
    authAPI.getMe()
      .then((res) => setUser(res.data.data))
      .catch(() => { clearTokens(); })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authAPI.login({ email, password });
    const { user, accessToken, refreshToken } = res.data.data;
    setTokens(accessToken, refreshToken);
    setUser(user);
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const res = await authAPI.register({ name, email, password, phone });
    const { user, accessToken, refreshToken } = res.data.data;
    setTokens(accessToken, refreshToken);
    setUser(user);
  };

  const logout = async () => {
    try { await authAPI.logout(); } catch { /* ignore */ }
    clearTokens();
    setUser(null);
  };

  const refreshUser = async () => {
    const res = await authAPI.getMe();
    setUser(res.data.data);
  };

  const updateUser = (u: User) => setUser(u);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin: user?.role === 'admin', login, register, logout, refreshUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
