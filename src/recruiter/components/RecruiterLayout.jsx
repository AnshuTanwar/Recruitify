import { motion } from 'framer-motion';
import RecruiterSidebar from './RecruiterSidebar';

function RecruiterLayout({ children }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      transition={{ duration: 0.5 }} 
      className="min-h-screen text-white"
    >
      <RecruiterSidebar />
      
      <div className="ml-64 relative z-10">
        <main className="p-6">
          {children}
        </main>
      </div>
    </motion.div>
  );
}

export default RecruiterLayout;
