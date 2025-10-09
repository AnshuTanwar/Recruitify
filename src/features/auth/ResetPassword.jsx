import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Card from '../../components/ui/Card.jsx';
import ApiService from '../../services/apiService.js';

function ResetPassword() {
  const { userId, token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    newPassword: '', 
    confirmPassword: '' 
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
    return Math.min(strength, 5);
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(formData.newPassword));
  }, [formData.newPassword]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setErrors({});
    
    try {
      // Call backend API for password reset - matches your backend route
      await ApiService.resetPassword(userId, token, formData.newPassword);
      
      setIsPasswordReset(true);
      // Auto-redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Reset password error:', error);
      setErrors({ general: error.message || 'Failed to reset password. The link may be expired or invalid.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStrengthColor = (strength) => {
    if (strength < 2) return 'bg-red-500';
    if (strength < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = (strength) => {
    if (strength < 2) return 'Weak';
    if (strength < 4) return 'Medium';
    return 'Strong';
  };

  if (isPasswordReset) {
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
            
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-white mb-2">Password Reset Successful!</h1>
            <p className="text-xs xs:text-sm sm:text-base text-white/70 mb-6">
              Your password has been successfully reset. You can now login with your new password.
            </p>
            
            <div className="space-y-4">
              <Link to="/login">
                <motion.button
                  className="w-full px-4 py-2.5 xs:py-3 bg-gradient-to-r from-teal-500 to-purple-600 text-white rounded-lg font-medium transition-all duration-300 text-sm xs:text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Go to Login
                </motion.button>
              </Link>
              
              <p className="text-xs text-white/60">
                Redirecting to login in 3 seconds...
              </p>
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
        <Card className="w-full max-w-xs xs:max-w-sm sm:max-w-md">
        <div className="text-center mb-4 xs:mb-6 sm:mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Lock className="w-8 h-8 text-purple-400" />
          </motion.div>
          
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-white mb-1 xs:mb-2 leading-tight">
            Reset Password
          </h1>
          <p className="text-xs xs:text-sm sm:text-base text-white/70">
            Enter your new password below
          </p>
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

        <form onSubmit={handleSubmit} className="space-y-4 xs:space-y-6">
          <div>
            <div className="relative">
              <Input 
                label="New Password" 
                type={showPassword ? "text" : "password"}
                value={formData.newPassword} 
                onChange={(v) => setFormData({ ...formData, newPassword: v })} 
                error={errors.newPassword} 
                required 
                placeholder="Enter your new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {formData.newPassword && (
              <motion.div
                className="mt-2 space-y-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between text-xs xs:text-sm">
                  <span className="text-white/70">Password strength:</span>
                  <span className={`font-medium ${passwordStrength < 2 ? 'text-red-400' : passwordStrength < 4 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {getStrengthText(passwordStrength)}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 xs:h-2">
                  <motion.div
                    className={`h-full rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </motion.div>
            )}
          </div>

          <div className="relative">
            <Input 
              label="Confirm New Password" 
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword} 
              onChange={(v) => setFormData({ ...formData, confirmPassword: v })} 
              error={errors.confirmPassword} 
              required 
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-300 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          <Button 
            type="submit" 
            loading={isSubmitting} 
            className="w-full text-sm xs:text-base py-2.5 xs:py-3"
          >
            {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </form>

        <motion.div 
          className="mt-6 sm:mt-8 text-center space-y-4" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
        >
          <Link 
            to="/login" 
            className="inline-flex items-center text-xs sm:text-sm text-teal-400 hover:text-teal-300 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
        </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}

export default ResetPassword;
