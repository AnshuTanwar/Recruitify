import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  User,
  Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';

const AdminSidebar = ({ onMobileClose, isMobileMenuOpen }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      name: 'Overview',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      count: null
    },
    {
      name: 'User Management',
      path: '/admin/users',
      icon: Users,
      count: null
    },
    {
      name: 'Analytics',
      path: '/admin/analytics',
      icon: BarChart3,
      count: null
    },
    {
      name: 'Profile',
      path: '/admin/profile',
      icon: User,
      count: null
    },
    {
      name: 'Settings',
      path: '/admin/settings',
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
        className={`${isMobileMenuOpen ? 'fixed' : 'hidden lg:block'} inset-y-0 left-0 z-30 h-full w-64 bg-slate-900/95 backdrop-blur-md border-r border-white/10 flex flex-col`}
        initial={false}
        animate={{ x: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
      {/* Logo Section */}
      <div className="p-3 sm:p-4 lg:p-6 border-b border-white/10 flex-shrink-0">
        <motion.div
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="relative"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center shadow-lg shadow-teal-500/25">
              <Zap className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
          </motion.div>
          <div>
            <h1 className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-white via-teal-200 to-purple-200 bg-clip-text text-transparent">
              Recruitify
            </h1>
            <p className="text-xs text-white/60 -mt-1 hidden lg:block">AI-Powered Hiring</p>
          </div>
        </motion.div>
      </div>

      {/* Dashboard Label */}
      <div className="px-3 sm:px-4 lg:px-6 py-3 lg:py-4 flex-shrink-0">
        <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider hidden lg:block">
          Admin Dashboard
        </h2>
      </div>

      {/* Navigation Menu */}
      <nav className="px-2 sm:px-3 pb-6 flex-1 overflow-y-auto">
        <ul className="space-y-2">
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
                  className={`relative flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-300 group ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500/20 to-purple-600/20 text-teal-400 border border-teal-500/30'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-teal-400' : 'text-white/70 group-hover:text-white'}`} />
                    <span className="font-medium text-sm lg:text-base">{item.name}</span>
                  </div>
                  
                  {item.count && (
                    <motion.span
                      className="bg-red-500 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium min-w-[20px] text-center"
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

      {/* Admin Profile Section */}
      <div className="p-3 sm:p-4 border-t border-white/10 flex-shrink-0">
        <motion.div
          className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="flex-1 hidden lg:block min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin User</p>
            <p className="text-xs text-white/60">Administrator</p>
          </div>
          <motion.button
            onClick={logout}
            className="p-1 rounded-md hover:bg-white/10 transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Logout"
          >
            <LogOut className="w-4 h-4 text-white/60 hover:text-red-400 transition-colors duration-300 flex-shrink-0" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
    </>
  );
};

export default AdminSidebar;
