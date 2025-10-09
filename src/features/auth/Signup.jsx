import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Card from '../../components/ui/Card.jsx';
import ApiService from '../../services/apiService.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'candidate' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [progress, setProgress] = useState(0);

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

  const calculateProgress = () => {
    const fields = Object.values(formData);
    const filledFields = fields.filter((field) => field.trim() !== '').length;
    return (filledFields / fields.length) * 100;
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

  useEffect(() => {
    setProgress(calculateProgress());
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setErrors({});
    
    try {
      // Call backend signup API
      const response = await ApiService.signup({
        fullName: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role === 'candidate' ? 'Candidate' : 'Recruiter'
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
      }

    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ 
        general: error.message || 'Signup failed. Please try again.' 
      });
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

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5 }} className="min-h-screen flex items-center justify-center px-3 xs:px-4 sm:px-6 lg:px-8 pt-12 xs:pt-14 sm:pt-16">
      <Card className="w-full max-w-xs xs:max-w-sm sm:max-w-md">
        <div className="text-center mb-4 xs:mb-6 sm:mb-8">
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-white mb-1 xs:mb-2 leading-tight">Create Account</h1>
          <p className="text-xs xs:text-sm sm:text-base text-white/70">Join our platform today</p>
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
          <Input label="Full Name" type="text" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} error={errors.name} required />
          <Input label="Email Address" type="email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} error={errors.email} required />
          
          <div>
            <Input label="Password" type="password" value={formData.password} onChange={(v) => setFormData({ ...formData, password: v })} error={errors.password} required />
            {formData.password && (
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

          <Input label="Confirm Password" type="password" value={formData.confirmPassword} onChange={(v) => setFormData({ ...formData, confirmPassword: v })} error={errors.confirmPassword} required />

          {/* Role Selection */}
          <div className="space-y-2 xs:space-y-3">
            <label className="block text-xs xs:text-sm font-medium text-white">Account Type</label>
            <div className="grid grid-cols-2 gap-2 xs:gap-3">
              <motion.button 
                type="button" 
                onClick={() => setFormData({ ...formData, role: 'candidate' })} 
                className={`p-2 xs:p-3 rounded-lg border-2 transition-all duration-300 ${
                  formData.role === 'candidate' 
                    ? 'border-teal-500 bg-teal-500/10 text-teal-400' 
                    : 'border-white/20 text-white/70 hover:border-white/40'
                }`} 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 mx-auto mb-1 xs:mb-2">👨‍💼</div>
                <span className="text-xs xs:text-sm font-medium">Candidate</span>
              </motion.button>
              <motion.button 
                type="button" 
                onClick={() => setFormData({ ...formData, role: 'recruiter' })} 
                className={`p-2 xs:p-3 rounded-lg border-2 transition-all duration-300 ${
                  formData.role === 'recruiter' 
                    ? 'border-purple-500 bg-purple-500/10 text-purple-400' 
                    : 'border-white/20 text-white/70 hover:border-white/40'
                }`} 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 mx-auto mb-1 xs:mb-2">🏢</div>
                <span className="text-xs xs:text-sm font-medium">Recruiter</span>
              </motion.button>
            </div>
          </div>

          {formData.confirmPassword && (
            <motion.div 
              className="space-y-1" 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-2">
                {formData.password === formData.confirmPassword ? (
                  <Check className="w-3 h-3 xs:w-4 xs:h-4 text-green-400" />
                ) : (
                  <X className="w-3 h-3 xs:w-4 xs:h-4 text-red-400" />
                )}
                <span className={`text-xs xs:text-sm ${formData.password === formData.confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                  {formData.password === formData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                </span>
              </div>
            </motion.div>
          )}

          <Button type="submit" loading={isSubmitting} className="w-full mb-3 xs:mb-4 text-sm xs:text-base py-2.5 xs:py-3">Create Account</Button>

          <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <p className="text-xs xs:text-sm text-white/70">
              Already have an account?{' '}
              <Link to="/login" className="text-teal-400 hover:text-teal-300 transition-colors duration-300 font-semibold">Sign in here</Link>
            </p>
          </motion.div>
        </form>

        <motion.div className="mt-4 xs:mt-6 sm:mt-8 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Link to="/" className="text-xs xs:text-sm text-white/60 hover:text-white transition-colors duration-300">← Back to Home</Link>
        </motion.div>
      </Card>
    </motion.div>
  );
}

export default Signup;


