import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function TypewriterText({ text, className = '', delay = 0 }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
  }, [text, delay]);

  useEffect(() => {
    if (currentIndex >= text.length) return;
    const timeout = setTimeout(() => {
      setDisplayText(text.slice(0, currentIndex + 1));
      setCurrentIndex((i) => i + 1);
    }, currentIndex === 0 ? delay : 100);
    return () => clearTimeout(timeout);
  }, [currentIndex, text, delay]);

  return (
    <motion.h1
      className={`font-bold text-white ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayText}
      <motion.span className="text-teal-400" animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }}>
        |
      </motion.span>
    </motion.h1>
  );
}

export default TypewriterText;


