import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar.jsx';
import AnimatedBackground from '../../../components/common/AnimatedBackground.jsx';

function DashboardLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex relative overflow-hidden text-white">
      <AnimatedBackground />

      {/* Mobile Menu Button */}
      <motion.button
        className="fixed top-4 left-4 z-[60] lg:hidden bg-slate-900/90 backdrop-blur-md p-3 rounded-lg border border-white/20 text-white shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop */}
      <div className="hidden lg:block w-64 flex-shrink-0 relative z-30">
        <Sidebar isMobileMenuOpen={false} onMobileClose={() => {}} />
      </div>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <Sidebar isMobileMenuOpen={isMobileMenuOpen} onMobileClose={() => setIsMobileMenuOpen(false)} />
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <div className="flex-1 relative z-10 min-h-screen w-full">
        <main className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-6">
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
}

export default DashboardLayout;
