import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  UserPlus, 
  Download, 
  Upload,
  Shield,
  ShieldCheck,
  ShieldX,
  User,
  Users,
  Briefcase,
  Calendar,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import AdminLayout from '../../../components/layout/AdminLayout.jsx';

const AdminUserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const users = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@techcorp.com',
      role: 'recruiter',
      status: 'active',
      avatar: 'SJ',
      company: 'TechCorp Solutions',
      location: 'San Francisco, CA',
      joinDate: '2023-01-15',
      lastActive: '2 hours ago',
      jobsPosted: 24,
      candidatesHired: 156
    },
    {
      id: 2,
      name: 'Alex Thompson',
      email: 'alex.thompson@email.com',
      role: 'candidate',
      status: 'active',
      avatar: 'AT',
      company: 'Freelancer',
      location: 'New York, NY',
      joinDate: '2023-02-20',
      lastActive: '1 day ago',
      applications: 12,
      interviews: 5
    },
    {
      id: 3,
      name: 'Maria Garcia',
      email: 'maria.garcia@designstudio.com',
      role: 'candidate',
      status: 'inactive',
      avatar: 'MG',
      company: 'Design Studio',
      location: 'Los Angeles, CA',
      joinDate: '2023-03-10',
      lastActive: '2 weeks ago',
      applications: 8,
      interviews: 2
    },
    {
      id: 4,
      name: 'David Chen',
      email: 'david.chen@startup.io',
      role: 'recruiter',
      status: 'pending',
      avatar: 'DC',
      company: 'StartupIO',
      location: 'Seattle, WA',
      joinDate: '2023-08-25',
      lastActive: 'Never',
      jobsPosted: 0,
      candidatesHired: 0
    },
    {
      id: 5,
      name: 'Emily Wilson',
      email: 'emily.wilson@bigcorp.com',
      role: 'admin',
      status: 'active',
      avatar: 'EW',
      company: 'BigCorp Inc',
      location: 'Chicago, IL',
      joinDate: '2022-11-08',
      lastActive: '30 minutes ago',
      permissions: 'Super Admin'
    }
  ];

  const stats = [
    {
      title: 'Total Users',
      value: '1,247',
      change: '+12%',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Active Recruiters',
      value: '89',
      change: '+5%',
      icon: Briefcase,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Active Candidates',
      value: '1,158',
      change: '+15%',
      icon: User,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Pending Approvals',
      value: '23',
      change: '-8%',
      icon: Clock,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="w-4 h-4 text-purple-500" />;
      case 'recruiter':
        return <Briefcase className="w-4 h-4 text-blue-500" />;
      case 'candidate':
        return <User className="w-4 h-4 text-green-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-white/70">Manage users, roles, and permissions across the platform</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 lg:p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm font-medium ${
                      stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Filters */}
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="recruiter">Recruiter</option>
                <option value="candidate">Candidate</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <motion.button
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </motion.button>
              <motion.button
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <UserPlus className="w-4 h-4" />
                <span>Add User</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-gray-50 transition-colors duration-300"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-white font-medium">
                          {user.avatar}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-xs text-gray-400 flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{user.location}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(user.role)}
                        <span className="capitalize font-medium text-gray-900">{user.role}</span>
                      </div>
                      <div className="text-sm text-gray-500">{user.company}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(user.status)}
                        <span className={`capitalize font-medium ${
                          user.status === 'active' ? 'text-green-700' :
                          user.status === 'inactive' ? 'text-red-700' :
                          'text-yellow-700'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">Joined {user.joinDate}</div>
                      <div className="text-xs text-gray-500">Last active: {user.lastActive}</div>
                    </td>
                    <td className="px-6 py-4">
                      {user.role === 'recruiter' ? (
                        <div className="text-sm">
                          <div className="text-gray-900">{user.jobsPosted} jobs posted</div>
                          <div className="text-gray-500">{user.candidatesHired} hires</div>
                        </div>
                      ) : user.role === 'candidate' ? (
                        <div className="text-sm">
                          <div className="text-gray-900">{user.applications} applications</div>
                          <div className="text-gray-500">{user.interviews} interviews</div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">{user.permissions}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <motion.button
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">Try adjusting your search terms or filters.</p>
            </div>
          )}
        </motion.div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-teal-500"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-900">
                  {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-300">
                  Activate
                </button>
                <button className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors duration-300">
                  Suspend
                </button>
                <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-300">
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUserManagement;
