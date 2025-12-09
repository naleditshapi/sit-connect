import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { User } from '../types';

// #region Types
interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}
// #endregion Types

// #region Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = '@sitconnect_user';
// #endregion Auth Context

// #region Auth Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // #region Load user 
  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log('✅ Restored user session:', parsedUser.email);
      }
    } catch (error) {
      console.error('❌ Error loading stored user:', error);
    } finally {
      setLoading(false);
    }
  };
  // #endregion Load user

  // #region Login
  const login = async (userData: User) => {
    try {
      setUser(userData);

      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      console.log('User logged in and saved:', userData.email);
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  };
  // #endregion Login

  // #region Logout
  const logout = async () => {
    try {
      setUser(null);

      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      console.log('User logged out');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };
  // #endregion Logout

  // #region Context Value
  const value = {
    user,
    loading,
    setUser,
    login,
    logout,
    isAuthenticated: user !== null,
  };
  // #endregion Context Value
  // #region Render
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
  // #endregion Render

};

// #region useAuth Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
// #endregion useAuth Hook