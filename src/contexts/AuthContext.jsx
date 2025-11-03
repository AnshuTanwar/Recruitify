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
          const parsedUserData = JSON.parse(userData);
          
          // Verify token is still valid with role-specific validation
          const isTokenValid = await validateTokenForRole(parsedUserData.role);
          
          if (isTokenValid) {
            // Token is valid, restore authentication state
            setUser(parsedUserData);
            setIsAuthenticated(true);
            console.log('✅ User authenticated on refresh:', parsedUserData);
          } else {
            // Token is invalid or expired and refresh failed
            console.warn('⚠️ Token validation and refresh failed');
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

  // Validate token based on user role
  const validateTokenForRole = async (userRole) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token || token === 'null' || token === 'undefined') {
        return false;
      }

      let endpoint;
      // Choose appropriate endpoint based on user role
      switch (userRole?.toLowerCase()) {
        case 'candidate':
          endpoint = '/api/candidate/profile';
          break;
        case 'recruiter':
          endpoint = '/api/recruiter/profile';
          break;
        case 'admin':
          endpoint = '/api/admin/overview';
          break;
        default:
          // Fallback to a general endpoint
          endpoint = '/api/candidate/profile';
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://recruitify-backend-f2zw.onrender.com'}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        return true;
      } else if (response.status === 401 || response.status === 403) {
        // Token expired, try to refresh
        console.log('Access token expired, attempting refresh...');
        try {
          const refreshResult = await ApiService.refreshToken();
          if (refreshResult && refreshResult.accessToken) {
            localStorage.setItem('authToken', refreshResult.accessToken);
            console.log('✅ Token refreshed successfully in AuthContext');
            return true;
          }
          return false;
        } catch (refreshError) {
          console.warn('❌ Token refresh failed in AuthContext:', refreshError);
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      console.warn('Token validation failed:', error);
      // Try to refresh as fallback
      try {
        const refreshResult = await ApiService.refreshToken();
        if (refreshResult && refreshResult.accessToken) {
          localStorage.setItem('authToken', refreshResult.accessToken);
          console.log('✅ Token refreshed successfully in AuthContext (fallback)');
          return true;
        }
        return false;
      } catch (refreshError) {
        console.warn('Token refresh also failed:', refreshError);
        return false;
      }
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
