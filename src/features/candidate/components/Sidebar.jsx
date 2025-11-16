import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  User, 
  Calendar, 
  Bell, 
  Settings, 
  LogOut, 
  MessageSquare,
  MessageCircle,
  HelpCircle,
  Zap,
  Search,
  BarChart3,
  Mic
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext.jsx';

function Sidebar({ isMobileMenuOpen, onMobileClose }) {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      name: 'Overview',
      path: '/dashboard',
      icon: LayoutDashboard,
      count: null
    },
    {
      name: 'Browse Jobs',
      path: '/dashboard/jobs',
      icon: Search,
      count: null
    },
    {
      name: 'Applied Jobs',
      path: '/dashboard/applied-jobs',
      icon: Briefcase,
      count: null
    },
    {
      name: 'Messages',
      path: '/dashboard/messages',
      icon: MessageCircle,
      count: null
    },
    {
      name: 'Resume Analyzer',
      path: '/dashboard/resume-analyzer',
      icon: BarChart3,
      count: null,
      isNew: true
    },
    {
      name: 'AI Voice Interview',
      path: '/dashboard/ai-interview',
      icon: Mic,
      count: null,
      isNew: true
    },
    {
      name: 'Profile',
      path: '/dashboard/profile',
      icon: User,
      count: null
    },
    {
      name: 'Job Alerts',
      path: '/dashboard/job-alerts',
      icon: Bell,
      count: null
    },
    {
      name: 'Help',
      path: '/dashboard/help',
      icon: HelpCircle,
      count: null
    },
    {
      name: 'Settings',
      path: '/dashboard/settings',
      icon: Settings,
      count: null
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onMobileClose}
        />
      )}
      
      {/* Sidebar */}
      <motion.div
        className={`${isMobileMenuOpen ? 'fixed' : 'hidden lg:fixed lg:block'} inset-y-0 left-0 z-50 h-full w-64 sm:w-72 lg:w-64 bg-slate-900/95 backdrop-blur-md border-r border-white/10 flex flex-col shadow-2xl lg:shadow-none`}
        initial={{ x: isMobileMenuOpen ? -280 : 0 }}
        animate={{ x: 0 }}
        exit={{ x: -280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
      {/* Logo Section */}
      <div className="p-4 sm:p-5 lg:p-6 border-b border-white/10">
        <motion.div
          className="flex items-center space-x-2 xs:space-x-3"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="relative"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <div className="w-10 h-10 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center shadow-lg shadow-teal-500/25">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </motion.div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white via-teal-200 to-purple-200 bg-clip-text text-transparent truncate">
              Recruitify
            </h1>
            <p className="text-xs text-white/60 -mt-1">AI-Powered Hiring</p>
          </div>
        </motion.div>
      </div>

      {/* Dashboard Label */}
      <div className="px-4 sm:px-5 lg:px-6 py-3 sm:py-4">
        <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider">
          Candidate Dashboard
        </h2>
      </div>

      {/* Navigation Menu */}
      <nav className="px-3 pb-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <ul className="space-y-1.5">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  onClick={onMobileClose}
                  className={`relative flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 group ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500/20 to-purple-600/20 text-teal-400 border border-teal-500/30'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-teal-400' : 'text-white/70 group-hover:text-white'}`} />
                    <span className="font-medium text-sm truncate">{item.name}</span>
                    {item.isNew && (
                      <motion.span
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-[10px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      >
                        NEW
                      </motion.span>
                    )}
                  </div>
                  
                  {item.count && (
                    <motion.span
                      className="bg-teal-500 text-white text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 min-w-[20px] text-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    >
                      {item.count}
                    </motion.span>
                  )}

                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-400 to-purple-400 rounded-r-full"
                      layoutId="activeIndicator"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-white/10 flex-shrink-0">
        <motion.div
          className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {(() => {
                const saved = localStorage.getItem('candidateProfile');
                const profile = saved ? JSON.parse(saved) : {};
                return profile.fullName || 'Candidate';
              })()}
            </p>
            <p className="text-xs text-white/60">Candidate</p>
          </div>
          <motion.button
            onClick={logout}
            className="p-1.5 rounded-md hover:bg-white/10 transition-colors duration-300 flex-shrink-0"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Logout"
          >
            <LogOut className="w-4 h-4 text-white/60 hover:text-red-400 transition-colors duration-300" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
    </>
  );
}

export default Sidebar;
