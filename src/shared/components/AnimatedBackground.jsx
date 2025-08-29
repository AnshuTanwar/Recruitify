import { useMemo } from 'react';
import { motion } from 'framer-motion';

function AnimatedBackground() {
  const particles = useMemo(() => Array.from({ length: 50 }, (_, i) => i), []);

  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-800 to-sky-400" />
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}

export default AnimatedBackground;


