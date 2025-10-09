import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Briefcase, 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Shield,
  Settings,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/layout/AdminLayout.jsx';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const platformStats = [
    {
      title: 'Total Users',
      value: '12,847',
      change: '+12%',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      trend: 'up'
    },
    {
      title: 'Active Jobs',
      value: '3,421',
      change: '+8%',
      icon: Briefcase,
      color: 'from-green-500 to-green-600',
      trend: 'up'
    },
    {
      title: 'Companies',
      value: '1,256',
      change: '+15%',
      icon: Building2,
      color: 'from-purple-500 to-purple-600',
      trend: 'up'
    },
    {
      title: 'Monthly Revenue',
      value: '$89,432',
      change: '+23%',
      icon: DollarSign,
      color: 'from-yellow-500 to-orange-500',
      trend: 'up'
    }
  ];

  const recentUsers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@techcorp.com',
      role: 'Recruiter',
      company: 'TechCorp Inc.',
      status: 'Active',
      joinDate: '2025-01-15',
      verified: true
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@gmail.com',
      role: 'Candidate',
      company: null,
      status: 'Active',
      joinDate: '2025-01-14',
      verified: true
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily@startup.io',
      role: 'Recruiter',
      company: 'StartupIO',
      status: 'Pending',
      joinDate: '2025-01-13',
      verified: false
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david.kim@designer.com',
      role: 'Candidate',
      company: null,
      status: 'Active',
      joinDate: '2025-01-12',
      verified: true
    }
  ];

  // Get real jobs from localStorage
  const recentJobs = (() => {
    const savedJobs = localStorage.getItem('postedJobs');
    return savedJobs ? JSON.parse(savedJobs).slice(0, 5) : [];
  })();

  const filteredUsers = recentUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || user.role.toLowerCase() === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white"
        >
          <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-white/70">Platform overview and management tools</p>
        </motion.div>

        {/* Platform Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {platformStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <span className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">{stat.title}</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* User Management Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
              <h2 className="text-xl font-bold text-gray-900">User Management</h2>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users..."
                    className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="candidate">Candidates</option>
                  <option value="recruiter">Recruiters</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 hidden sm:table-row">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Join Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-300 sm:table-row block"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      {/* Desktop Layout */}
                      <td className="py-4 px-4 hidden sm:table-cell">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            {user.company && (
                              <p className="text-xs text-gray-400">{user.company}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden sm:table-cell">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === 'Recruiter' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-4 hidden sm:table-cell">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            user.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'
                          }`} />
                          <span className={`text-sm font-medium ${
                            user.status === 'Active' ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {user.status}
                          </span>
                          {user.verified && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden sm:table-cell">
                        <span className="text-sm text-gray-600">{user.joinDate}</span>
                      </td>
                      <td className="py-4 px-4 hidden sm:table-cell">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate('/admin/users')}
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate('/admin/users')}
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => console.log('Delete user')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>

                      {/* Mobile Layout */}
                      <td className="py-4 px-4 sm:hidden block w-full">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-medium text-sm">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{user.name}</p>
                                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                {user.company && (
                                  <p className="text-xs text-gray-400 truncate">{user.company}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  user.role === 'Recruiter' 
                                    ? 'bg-purple-100 text-purple-700' 
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {user.role}
                                </span>
                                <div className="flex items-center space-x-1">
                                  <div className={`w-2 h-2 rounded-full ${
                                    user.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'
                                  }`} />
                                  <span className={`text-xs font-medium ${
                                    user.status === 'Active' ? 'text-green-600' : 'text-yellow-600'
                                  }`}>
                                    {user.status}
                                  </span>
                                </div>
                              </div>
                              <span className="text-xs text-gray-500">{user.joinDate}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <motion.button
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/admin/users')}
                              >
                                View Profile
                              </motion.button>
                              <motion.button
                                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-300"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => navigate('/admin/users')}
                              >
                                <Edit className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Recent Job Postings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Job Postings</h2>
              <motion.button
                className="text-teal-600 hover:text-teal-700 font-medium"
                whileHover={{ x: 5 }}
                onClick={() => navigate('/admin/analytics')}
              >
                View All Jobs
              </motion.button>
            </div>

            <div className="space-y-4">
              {recentJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{job.title}</h3>
                          <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                          <p className="text-sm text-gray-500">{job.salary} • {job.applications} applications</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            job.status === 'Active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {job.status}
                          </span>
                          <motion.button
                            className="p-1 text-gray-400 hover:text-gray-600"
                            whileHover={{ scale: 1.1 }}
                            onClick={() => navigate('/admin/analytics')}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
