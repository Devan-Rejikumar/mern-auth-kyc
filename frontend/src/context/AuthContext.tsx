import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.AUTH.ME);
      setUser({
        id: res.data.id,
        email: res.data.email,
        role: res.data.role,
      });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = async (email: string, password: string) => {
    await api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
    await fetchMe();
  };

  const adminLogin = async (email: string, password: string) => {
    await api.post(API_ENDPOINTS.ADMIN.LOGIN, { email, password });
    await fetchMe();
  };

  const register = async (email: string, username: string, phone: string, password: string) => {
    await api.post(API_ENDPOINTS.AUTH.REGISTER, { email, username, phone, password });
  };

  const logout = async () => {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        adminLogin,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

