import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';

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
  register: (email: string, username: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await api.get('/auth/me');
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
    // #region agent log
    console.log('[DEBUG] login() called, will POST to', import.meta.env.DEV ? 'http://localhost:5000/api' : 'VITE_API_URL', '/auth/login');
    fetch('http://127.0.0.1:7244/ingest/3f836a50-eef8-48c0-88b9-ffb3ad0219f3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:login',message:'login called',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H8'})}).catch(()=>{});
    // #endregion
    await api.post('/auth/login', { email, password });
    await fetchMe(); // backend decides auth
  };

  const register = async (email: string, username: string, phone: string, password: string) => {
    await api.post('/auth/register', { email, username, phone, password });
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
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
