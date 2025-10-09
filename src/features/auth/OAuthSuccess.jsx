import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';

function OAuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Store the token and user data
      localStorage.setItem('authToken', token);
      
      // You might want to decode the JWT to get user info
      // For now, we'll set a default user type
      localStorage.setItem('userType', 'candidate');
      
      // Create basic user data structure
      const userData = {
        email: '', // This would come from the JWT token in a real implementation
        role: 'candidate',
        loginDate: new Date().toISOString(),
        provider: 'google'
      };
      
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Redirect to dashboard
      navigate('/dashboard', { replace: true });
    } else {
      // No token found, redirect to login with error
      navigate('/login?error=oauth_failed', { replace: true });
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <LoadingSpinner />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-white/70 mt-4 text-lg"
        >
          Completing your sign in...
        </motion.p>
      </motion.div>
    </div>
  );
}

export default OAuthSuccess;
