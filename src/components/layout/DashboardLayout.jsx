import React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar.jsx';

const DashboardLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-800 to-sky-400 relative overflow-x-hidden">
      {/* Background matching landing page */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-800 to-sky-400" />
      <div className="absolute inset-0 bg-black/20" />

      {/* Mobile Menu Button */}
      <motion.button
        className="fixed top-4 left-4 z-50 lg:hidden bg-white/10 backdrop-blur-md p-2 sm:p-3 rounded-lg border border-white/20 text-white shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} onMobileClose={() => setIsMobileMenuOpen(false)} />
      
      <div className="lg:ml-64 relative z-10 min-h-screen">
        <main className="p-3 sm:p-4 lg:p-6 pt-16 sm:pt-20 lg:pt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
