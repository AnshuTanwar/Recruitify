import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  const particles = Array.from({ length: (typeof window !== 'undefined' && window.innerWidth < 768) ? 25 : 50 }, (_, i) => i);

  return (
    <div className="fixed inset-0 -z-10">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-800 to-sky-400" />
      
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle}
            className="absolute w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white rounded-full opacity-10 sm:opacity-20"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            }}
            animate={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
      
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
};

export default AnimatedBackground;
