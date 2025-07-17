import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

/**
 * Authentication Context Provider
 * Manages user authentication state and provides login/logout functionality
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on app start
    const initializeAuth = () => {
      try {
        const token = apiService.getAuthToken();
        const savedUser = localStorage.getItem('boomi-dashboard-user');
        
        if (token && savedUser && apiService.isAuthenticated()) {
          setUser(JSON.parse(savedUser));
        } else {
          // Clear invalid data
          apiService.removeAuthToken();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        apiService.removeAuthToken();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await apiService.login(credentials);
      
      // Store token and user data
      apiService.setAuthToken(response.token);
      localStorage.setItem('boomi-dashboard-user', JSON.stringify(response.user));
      
      setUser(response.user);
    } catch (error) {
      // Clean up on login failure
      apiService.removeAuthToken();
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiService.removeAuthToken();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use authentication context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};