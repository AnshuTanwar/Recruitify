import React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import AdminSidebar from './AdminSidebar.jsx';
import AnimatedBackground from '../common/AnimatedBackground.jsx';

const AdminLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex relative overflow-x-hidden">
      <AnimatedBackground />

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
      <div className="hidden lg:block w-64 flex-shrink-0">
        <AdminSidebar onMobileClose={() => setIsMobileMenuOpen(false)} isMobileMenuOpen={isMobileMenuOpen} />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <AdminSidebar onMobileClose={() => setIsMobileMenuOpen(false)} isMobileMenuOpen={isMobileMenuOpen} />
          </div>
        )}
      </AnimatePresence>
      
      <div className="flex-1 relative z-20 min-h-screen">
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

export default AdminLayout;
