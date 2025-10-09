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
      className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 md:p-6 shadow-xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
      {...domProps}
    >
      {children}
    </motion.div>
  );
};

export default Card;
