import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative mb-6">
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          required={required}
          className={`w-full px-4 py-4 text-sm sm:text-base bg-white/10 backdrop-blur-sm rounded-xl border ${
            error ? 'border-red-400/60' : 'border-white/20'
          } text-white placeholder-white/50 focus:outline-none focus:border-teal-400/80 focus:bg-white/15 hover:bg-white/12 transition-all duration-300 shadow-lg`}
        />
        
        {(isFocused || value) && (
          <motion.label
            className="absolute -top-3 left-4 text-xs bg-gradient-to-r from-teal-600 to-purple-600 px-3 py-1 rounded-lg backdrop-blur-sm shadow-lg font-medium text-white pointer-events-none"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -2, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {label}
          </motion.label>
        )}
        
        {(isFocused || value) && (
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-teal-400/30 pointer-events-none shadow-lg shadow-teal-400/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.div>
      
      {error && (
        <motion.p
          className="text-red-400 text-xs sm:text-sm mt-1"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input;
