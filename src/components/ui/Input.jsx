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
          className={`w-full px-3 xs:px-3.5 sm:px-4 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm sm:text-base bg-white/10 backdrop-blur-sm rounded-lg border ${
            error ? 'border-red-400' : 'border-white/20'
          } text-white placeholder-white/50 focus:outline-none focus:border-teal-400 transition-all duration-300`}
        />
        
        <motion.label
          className={`absolute left-3 xs:left-3.5 sm:left-4 text-white/70 pointer-events-none transition-all duration-300 ${
            isFocused || value
              ? '-top-2 text-xs bg-gradient-to-br from-slate-900 via-purple-800 to-sky-400 px-2 rounded'
              : 'top-2 xs:top-2.5 sm:top-3 text-xs xs:text-xs sm:text-sm'
          }`}
          animate={{
            y: isFocused || value ? -8 : 0,
            scale: isFocused || value ? 0.9 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
        
        {(isFocused || value) && (
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-teal-400/50 pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
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
