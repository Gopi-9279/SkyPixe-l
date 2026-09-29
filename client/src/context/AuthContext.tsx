import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types/index.js';
import { loginAdmin, fetchCurrentAdmin, logoutAdmin } from '../api/auth.js';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await fetchCurrentAdmin();
        setUser(currentUser);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const data = await loginAdmin(credentials);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await logoutAdmin();
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
