import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import ApiService from '../../services/apiService.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
 
function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setErrors({});
    
    try {
      // Backend login
      const response = await ApiService.login({
        email: formData.email,
        password: formData.password
      });

      // Use AuthContext login method
      login(response.user, response.accessToken, response.user.role.toLowerCase());

      // Initialize profile based on user role
      if (response.user.role === 'Candidate') {
        const candidateProfile = {
          fullName: response.user.fullName || '',
          email: response.user.email,
          phone: '',
          location: '',
          experience: '',
          education: '',
          website: '',
          bio: '',
          skills: []
        };
        localStorage.setItem('candidateProfile', JSON.stringify(candidateProfile));
        navigate('/dashboard');
      } else if (response.user.role === 'Recruiter') {
        const recruiterProfile = {
          fullName: response.user.fullName || '',
          email: response.user.email,
          company: '',
          phone: '',
          location: '',
          website: '',
          bio: ''
        };
        localStorage.setItem('recruiterProfile', JSON.stringify(recruiterProfile));
        navigate('/recruiter/dashboard');
      } else if (response.user.role === 'Admin') {
        navigate('/admin/dashboard');
      }

    } catch (error) {
      console.error('Login error:', error);
      setErrors({ 
        general: error.message || 'Login failed. Please check your credentials and try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5050'}/api/auth/google`;
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5 }} className="min-h-screen flex items-center justify-center px-3 xs:px-4 sm:px-6 lg:px-8 pt-12 xs:pt-14 sm:pt-16">
      <Card className="w-full max-w-xs xs:max-w-sm sm:max-w-md">
        <div className="text-center mb-4 xs:mb-6 sm:mb-8">
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-white mb-1 xs:mb-2 leading-tight">Welcome Back</h1>
          <p className="text-xs xs:text-sm sm:text-base text-white/70">Sign in to your account</p>
        </div>
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-500/10 border border-red-400/20 rounded-lg"
          >
            <p className="text-red-400 text-sm text-center">{errors.general}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 xs:space-y-4 sm:space-y-6">
          <Input label="Email Address" type="email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} error={errors.email} required />
          <Input label="Password" type="password" value={formData.password} onChange={(v) => setFormData({ ...formData, password: v })} error={errors.password} required />
          
          {/* Forgot Password Link */}
          <div className="text-right">
            <Link 
              to="/forgot-password" 
              className="text-xs sm:text-sm text-teal-400 hover:text-teal-300 transition-colors duration-300"
            >
              Forgot your password?
            </Link>
          </div>
          
          <Button type="submit" loading={isSubmitting} className="w-full mb-3 xs:mb-4 text-sm xs:text-base py-2.5 xs:py-3">Sign In</Button>
          
          {/* Divider */}
          <div className="relative my-4 xs:my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-xs xs:text-sm">
              <span className="bg-gray-900 px-2 text-white/60">Or continue with</span>
            </div>
          </div>
          
          {/* Google OAuth Button */}
          <motion.button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center px-4 py-2.5 xs:py-3 border border-white/20 rounded-lg bg-white hover:bg-gray-50 text-gray-900 font-medium transition-all duration-300 text-sm xs:text-base"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </motion.button>
          
          
          <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <p className="text-xs sm:text-sm text-white/70">
              Don't have an account?{' '}
              <Link to="/signup" className="text-teal-400 hover:text-teal-300 transition-colors duration-300 font-semibold">Sign up here</Link>
            </p>
          </motion.div>
        </form>

        <motion.div className="mt-6 sm:mt-8 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Link to="/" className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors duration-300">← Back to Home</Link>
        </motion.div>
      </Card>
    </motion.div>
  );
}

export default Login;



