import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import LoadingSpinner from '../ui/LoadingSpinner.jsx';

const PrivateRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('🔒 Access denied: User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific role is required, check user role
  if (requiredRole && user?.role?.toLowerCase() !== requiredRole.toLowerCase()) {
    console.log(`🔒 Access denied: Required role ${requiredRole}, user has ${user?.role}`);
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has required role (if specified)
  console.log('✅ Access granted to protected route');
  return children;
};

export default PrivateRoute;
