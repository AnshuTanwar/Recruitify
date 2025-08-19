import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Card from '../components/Card.jsx';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
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
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    navigate('/login');
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
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.5 }} className="min-h-screen flex items-center justify-center px-4 py-8 pt-20">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">Join the Future</h1>
          <p className="text-white/70 text-lg">Create your account and start your journey</p>
        </motion.div>

        <Card className="relative overflow-hidden">
          <motion.div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-teal-600/20 rounded-xl" animate={{
            background: [
              'linear-gradient(to bottom right, rgba(147, 51, 234, 0.2), rgba(20, 184, 166, 0.2))',
              'linear-gradient(to bottom right, rgba(20, 184, 166, 0.2), rgba(147, 51, 234, 0.2))',
            ],
          }} transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }} />

          <div className="relative z-10">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white/70">Progress</span>
                <span className="text-sm font-medium text-white/70">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div className="bg-gradient-to-r from-teal-500 to-purple-600 h-2 rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <Input label="Full Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} error={errors.name} required />
              <Input label="Email Address" type="email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} error={errors.email} required />

              <div className="mb-6">
                <Input label="Password" type="password" value={formData.password} onChange={(v) => setFormData({ ...formData, password: v })} error={errors.password} required />
                {formData.password && (
                  <motion.div className="mt-2" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white/70">Password Strength</span>
                      <span className={`text-sm font-medium ${passwordStrength < 2 ? 'text-red-400' : passwordStrength < 4 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {getStrengthText(passwordStrength)}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className={`h-1 flex-1 rounded ${i < passwordStrength ? getStrengthColor(passwordStrength) : 'bg-white/20'}`} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              <Input label="Confirm Password" type="password" value={formData.confirmPassword} onChange={(v) => setFormData({ ...formData, confirmPassword: v })} error={errors.confirmPassword} required />

              {formData.confirmPassword && (
                <motion.div className="mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <div className="flex items-center space-x-2">
                    {formData.password === formData.confirmPassword ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <X className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`text-sm ${formData.password === formData.confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                      {formData.password === formData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                    </span>
                  </div>
                </motion.div>
              )}

              <Button type="submit" loading={isSubmitting} className="w-full mb-6">Create Account</Button>

              <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <p className="text-white/70">
                  Already have an account?{' '}
                  <Link to="/login" className="text-teal-400 hover:text-teal-300 transition-colors duration-300 font-semibold">Sign in here</Link>
                </p>
              </motion.div>
            </form>
          </div>
        </Card>

        <motion.div className="mt-8 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Link to="/" className="text-white/60 hover:text-white transition-colors duration-300">← Back to Home</Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Signup;


