import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover, ...props }) => {
  // Filter out non-DOM props to avoid React warnings
  const { 
    // Add any other custom props here that shouldn't be passed to DOM
    ...domProps 
  } = props;

  return (
    <motion.div
      className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/20 ${className}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={hover ? { scale: 1.02, y: -4, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)" } : undefined}
      {...domProps}
    >
      {children}
    </motion.div>
  );
};

export default Card;
