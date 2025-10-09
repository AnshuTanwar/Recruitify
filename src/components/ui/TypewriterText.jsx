import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TypewriterText = ({
  text,
  className = '',
  delay = 0,
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }
    }, delay + currentIndex * 100);

    return () => clearTimeout(timer);
  }, [currentIndex, text, delay]);

  return (
    <motion.h1
      className={`font-bold text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayText}
      <motion.span
        className="text-teal-400"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        |
      </motion.span>
    </motion.h1>
  );
};

export default TypewriterText;
