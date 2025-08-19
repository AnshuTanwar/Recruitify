import { motion } from 'framer-motion';

function Card({ children, className = '', hover = true }) {
  return (
    <motion.div
      className={`relative overflow-hidden bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -10, scale: 1.02 } : {}}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
      <div className="relative z-10 p-6">
        {children}
      </div>
    </motion.div>
  );
}

export default Card;


