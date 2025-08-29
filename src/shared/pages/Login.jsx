import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Card from '../components/Card.jsx';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    
    // For demo purposes, route based on email domain
    // In real app, this would be determined by user role from API
    if (formData.email.includes('recruiter') || formData.email.includes('hr')) {
      navigate('/recruiter/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5 }} className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">Welcome Back</h1>
          <p className="text-white/70 text-lg">Sign in to your account to continue</p>
        </motion.div>

        <Card className="relative overflow-hidden">
          <motion.div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-purple-600/20 rounded-xl" animate={{
            background: [
              'linear-gradient(to bottom right, rgba(20, 184, 166, 0.2), rgba(147, 51, 234, 0.2))',
              'linear-gradient(to bottom right, rgba(147, 51, 234, 0.2), rgba(20, 184, 166, 0.2))',
            ],
          }} transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }} />

          <div className="relative z-10">
            <form onSubmit={handleSubmit}>
              <Input label="Email Address" type="email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} error={errors.email} required />
              <Input label="Password" type="password" value={formData.password} onChange={(v) => setFormData({ ...formData, password: v })} error={errors.password} required />
              <Button type="submit" loading={isSubmitting} className="w-full mb-6">Sign In</Button>
              <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <p className="text-white/70">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-teal-400 hover:text-teal-300 transition-colors duration-300 font-semibold">Sign up here</Link>
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

export default Login;


