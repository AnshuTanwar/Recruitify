import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  ArrowLeft, 
  Search, 
  AlertTriangle,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import AnimatedBackground from './AnimatedBackground.jsx';
import Header from '../layout/Header.jsx';
import Footer from '../layout/Footer.jsx';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const quickLinks = [
    {
      title: 'Browse Jobs',
      description: 'Find your next opportunity',
      path: '/dashboard/jobs',
      icon: Search,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'For Recruiters',
      description: 'Post jobs and find talent',
      path: '/recruiter/dashboard',
      icon: HelpCircle,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Help Center',
      description: 'Get support and answers',
      path: '/dashboard/help',
      icon: HelpCircle,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      <Header />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* 404 Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="relative">
              <motion.h1
                className="text-8xl sm:text-9xl lg:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-purple-500 to-pink-500"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                style={{ backgroundSize: '200% 200%' }}
              >
                404
              </motion.h1>
              
              {/* Floating Elements */}
              <motion.div
                className="absolute top-1/4 left-1/4 w-4 h-4 bg-teal-400 rounded-full opacity-60"
                animate={{ 
                  y: [-20, 20, -20],
                  x: [-10, 10, -10],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
              <motion.div
                className="absolute top-1/3 right-1/4 w-6 h-6 bg-purple-400 rounded-full opacity-40"
                animate={{ 
                  y: [20, -20, 20],
                  x: [10, -10, 10],
                  scale: [1.2, 1, 1.2]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
              <motion.div
                className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-pink-400 rounded-full opacity-50"
                animate={{ 
                  y: [-15, 15, -15],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <AlertTriangle className="w-16 h-16 text-yellow-500" />
              </motion.div>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              The page you're looking for seems to have vanished into the digital void. 
              Don't worry, even the best explorers sometimes take a wrong turn!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <motion.button
              onClick={handleGoHome}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-teal-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </motion.button>
            
            <motion.button
              onClick={handleGoBack}
              className="flex items-center space-x-2 px-8 py-3 bg-white/10 backdrop-blur-md text-white rounded-lg font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </motion.button>
            
            <motion.button
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-8 py-3 bg-white/10 backdrop-blur-md text-white rounded-lg font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </motion.button>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="max-w-4xl mx-auto"
          >
            <h3 className="text-xl font-semibold text-white mb-6">
              Or explore these popular sections:
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <motion.div
                    key={link.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                    onClick={() => navigate(link.path)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${link.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-teal-300 transition-colors duration-300">
                      {link.title}
                    </h4>
                    <p className="text-white/70 text-sm group-hover:text-white/90 transition-colors duration-300">
                      {link.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Fun Fact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-12 text-center"
          >
            <p className="text-white/60 text-sm italic">
              💡 Fun fact: The first 404 error was discovered at CERN in 1992. 
              You're now part of internet history!
            </p>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;
