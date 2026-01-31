import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api';
import { User, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        api.setToken(token);
        const userData = await api.get<User>('/auth/me');
        setUser(userData);
      }
    } catch (error) {
      console.log('Auth check failed:', error);
      await AsyncStorage.removeItem('token');
      api.setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    api.setToken(response.access_token);
    setUser(response.user);
  };

  const signup = async (email: string, password: string, name: string) => {
    const response = await api.post<AuthResponse>('/auth/signup', { email, password, name });
    api.setToken(response.access_token);
    setUser(response.user);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    api.setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
