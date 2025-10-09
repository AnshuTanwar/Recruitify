import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  loading = false,
}) => {
  const baseClasses = 'relative px-3 xs:px-4 sm:px-6 md:px-8 py-2 xs:py-2.5 sm:py-3 rounded-lg font-semibold text-xs xs:text-sm sm:text-base transition-all duration-300 overflow-hidden group';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-teal-500 to-purple-600 text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:shadow-xl',
    secondary: 'bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 hover:border-white/30 hover:shadow-lg hover:shadow-white/10',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      whileHover={!disabled && !loading ? { 
        scale: (typeof window !== 'undefined' && window.innerWidth >= 768) ? 1.05 : 1.02, 
        y: (typeof window !== 'undefined' && window.innerWidth >= 768) ? -2 : -1,
        boxShadow: variant === 'primary' 
          ? '0 20px 40px rgba(20, 184, 166, 0.4), 0 0 30px rgba(147, 51, 234, 0.3)' 
          : '0 10px 30px rgba(255, 255, 255, 0.2)'
      } : {}}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Enhanced Glow Effect */}
      <motion.div
        className={`absolute inset-0 rounded-lg opacity-0 ${
          variant === 'primary' 
            ? 'bg-gradient-to-r from-teal-400 via-cyan-400 to-purple-500' 
            : 'bg-gradient-to-r from-white/20 to-white/10'
        }`}
        whileHover={{ 
          opacity: variant === 'primary' ? 0.4 : 0.2,
          scale: 1.02
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Pulse Ring Effect */}
      <motion.div
        className={`absolute inset-0 rounded-lg border-2 opacity-0 ${
          variant === 'primary' 
            ? 'border-teal-400' 
            : 'border-white/40'
        }`}
        whileHover={{
          opacity: [0, 0.6, 0],
          scale: [1, 1.1, 1.2],
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: 'easeOut'
        }}
      />

      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'easeInOut',
        }}
      />

      <span className="relative z-10 flex items-center justify-center">
        {loading ? (
          <motion.div
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          children
        )}
      </span>
    </motion.button>
  );
};

export default Button;
