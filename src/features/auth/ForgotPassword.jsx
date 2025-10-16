import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Card from '../../components/ui/Card.jsx';
import ApiService from '../../services/apiService.js';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setErrors({});
    
    try {
      console.log('Attempting to send forgot password request for:', email);
      // Call backend API for forgot password
      const response = await ApiService.forgotPassword(email);
      console.log('Forgot password response:', response);
      setIsEmailSent(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      setErrors({ email: error.message || 'Failed to send reset email. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          exit={{ opacity: 0, scale: 0.9 }} 
          transition={{ duration: 0.5 }} 
          className="relative min-h-screen flex items-center justify-center px-3 xs:px-4 sm:px-6 lg:px-8 pt-12 xs:pt-14 sm:pt-16"
        >
          <Card className="w-full max-w-xs xs:max-w-sm sm:max-w-md">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-green-400" />
            </motion.div>
            
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-white mb-2">Check Your Email</h1>
            <p className="text-xs xs:text-sm sm:text-base text-white/70 mb-6">
              We've sent a password reset link to <span className="font-medium text-white">{email}</span>
            </p>
            
            <div className="space-y-4">
              <motion.button
                onClick={() => setIsEmailSent(false)}
                className="w-full px-4 py-2.5 xs:py-3 text-teal-400 border border-teal-400/30 rounded-lg hover:bg-teal-400/10 transition-all duration-300 text-sm xs:text-base"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Try Different Email
              </motion.button>
              
              <Link to="/login">
                <motion.button
                  className="w-full px-4 py-2.5 xs:py-3 bg-gradient-to-r from-teal-500 to-purple-600 text-white rounded-lg font-medium transition-all duration-300 text-sm xs:text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back to Login
                </motion.button>
              </Link>
            </div>
          </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900"></div>
      <div className="absolute inset-0 bg-black/20"></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.9 }} 
        transition={{ duration: 0.5 }} 
        className="relative min-h-screen flex items-center justify-center px-3 xs:px-4 sm:px-6 lg:px-8 pt-12 xs:pt-14 sm:pt-16"
      >
        <Card className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 bg-gradient-to-br from-teal-500/30 to-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/10 shadow-lg"
          >
            <Mail className="w-10 h-10 text-teal-400" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight"
          >
            Forgot Password?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm sm:text-base text-white/70 leading-relaxed"
          >
            Enter your email address and we'll send you a link to reset your password.
          </motion.p>
        </div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Input 
            label="Email Address" 
            type="email" 
            value={email} 
            onChange={setEmail} 
            error={errors.email} 
            required 
          />
          
          <Button 
            type="submit" 
            loading={isSubmitting} 
            className="w-full text-base py-4 font-semibold"
          >
            {isSubmitting ? 'Sending Reset Link...' : 'Send Reset Link'}
          </Button>
        </motion.form>

        <motion.div 
          className="mt-8 text-center space-y-5" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.6 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/login" 
              className="inline-flex items-center text-sm text-teal-400 hover:text-teal-300 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/5 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </motion.div>
          
          <div className="text-sm text-white/60 leading-relaxed">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="text-teal-400 hover:text-teal-300 transition-colors duration-300 font-semibold hover:underline underline-offset-2"
            >
              Sign up here
            </Link>
          </div>
        </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;
