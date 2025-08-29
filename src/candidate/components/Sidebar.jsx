import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Zap, 
  LayoutDashboard, 
  Briefcase, 
  Bell, 
  Settings,
  LogOut,
  User
} from 'lucide-react';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    
    // Navigate to home page
    navigate('/');
  };

  const menuItems = [
    {
      name: 'Overview',
      path: '/dashboard',
      icon: LayoutDashboard,
      count: null
    },
    {
      name: 'Applied Jobs',
      path: '/applied-jobs',
      icon: Briefcase,
      count: null
    },
    {
      name: 'Job Alerts',
      path: '/job-alerts',
      icon: Bell,
      count: 9
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
      count: null
    }
  ];

  return (
    <motion.div
      className="fixed left-0 top-0 h-full w-64 bg-slate-900/95 backdrop-blur-md border-r border-white/10 z-40"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-white/10">
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
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center shadow-lg shadow-teal-500/25">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </motion.div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white via-teal-200 to-purple-200 bg-clip-text text-transparent">
              Recruitify
            </h1>
            <p className="text-xs text-white/60 -mt-1">AI-Powered Hiring</p>
          </div>
        </motion.div>
      </div>

      {/* Dashboard Label */}
      <div className="px-6 py-4">
        <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider">
          Candidate Dashboard
        </h2>
      </div>

      {/* Navigation Menu */}
      <nav className="px-3 pb-6">
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
                  className={`relative flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 group ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500/20 to-purple-600/20 text-teal-400 border border-teal-500/30'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-teal-400' : 'text-white/70 group-hover:text-white'}`} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  
                  {item.count && (
                    <motion.span
                      className="bg-teal-500 text-white text-xs px-2 py-1 rounded-full font-medium"
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
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <motion.div
          className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Esther Howard</p>
            <p className="text-xs text-white/60">Candidate</p>
          </div>
          <motion.button
            onClick={handleLogout}
            className="p-1 rounded-md hover:bg-white/10 transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Logout"
          >
            <LogOut className="w-4 h-4 text-white/60 hover:text-red-400 transition-colors duration-300" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Sidebar;
