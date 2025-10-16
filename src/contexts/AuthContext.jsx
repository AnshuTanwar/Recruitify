import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/apiService.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      const userType = localStorage.getItem('userType');

      if (token && userData && userType && token !== 'null' && token !== 'undefined') {
        try {
          // Verify token is still valid
          const isTokenValid = await ApiService.validateToken();
          
          if (isTokenValid) {
            // Token is valid, restore authentication state
            const parsedUserData = JSON.parse(userData);
            setUser(parsedUserData);
            setIsAuthenticated(true);
            console.log('✅ User authenticated on refresh:', parsedUserData);
          } else {
            // Token is invalid or expired
            console.warn('⚠️ Token validation failed');
            clearAuthData();
          }
        } catch (authError) {
          // Token validation error
          console.warn('⚠️ Token validation error:', authError.message);
          clearAuthData();
        }
      } else {
        console.log('❌ No valid authentication data found');
        clearAuthData();
      }
    } catch (error) {
      console.error('Auth check error:', error);
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData, token, userType) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('userType', userType);
    
    setUser(userData);
    setIsAuthenticated(true);
    console.log('✅ User logged in:', userData);
  };

  const logout = async () => {
    try {
      console.log('🔄 Starting logout process...');
      
      // Call backend logout API
      await ApiService.logout();
      console.log('✅ Backend logout successful');
      
    } catch (error) {
      console.error('❌ Logout API error:', error);
    } finally {
      // Clear authentication data
      clearAuthData();
      
      // Navigate to home page and replace history
      navigate('/', { replace: true });
      console.log('✅ Logout completed');
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
    localStorage.removeItem('candidateProfile');
    localStorage.removeItem('recruiterProfile');
    
    setUser(null);
    setIsAuthenticated(false);
    console.log('🧹 Authentication data cleared');
  };

  // Method to refresh authentication status
  const refreshAuth = async () => {
    setIsLoading(true);
    await checkAuthStatus();
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus,
    refreshAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
