import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Upload, 
  Edit, 
  Save,
  Camera,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Shield,
  Key,
  Bell,
  Globe,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Settings,
  Lock,
  Activity,
  Clock
} from 'lucide-react';
import AdminLayout from '../../../components/layout/AdminLayout.jsx';

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  
  const [profileData, setProfileData] = useState({
    fullName: 'Emily Wilson',
    email: 'emily.wilson@recruitify.com',
    phone: '+1 (555) 987-6543',
    location: 'Chicago, IL',
    role: 'Super Administrator',
    department: 'Platform Operations',
    joinDate: '2022-11-08',
    bio: 'Experienced platform administrator with expertise in system management, user operations, and data analytics.',
    permissions: [
      'User Management',
      'System Settings',
      'Analytics Access',
      'Database Management',
      'Security Configuration'
    ]
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    securityAlerts: true,
    maintenanceUpdates: true,
    theme: 'light',
    language: 'en',
    timezone: 'America/Chicago'
  });

  const stats = [
    {
      title: 'Days Active',
      value: '298',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Actions Performed',
      value: '2,847',
      icon: Activity,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Users Managed',
      value: '1,247',
      icon: User,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Last Login',
      value: '30m ago',
      icon: Clock,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const recentActivity = [
    { action: 'Updated user permissions for Sarah Johnson', time: '2 hours ago', type: 'user' },
    { action: 'Modified system security settings', time: '4 hours ago', type: 'security' },
    { action: 'Generated monthly analytics report', time: '1 day ago', type: 'report' },
    { action: 'Approved new recruiter registration', time: '2 days ago', type: 'approval' },
    { action: 'Updated email notification templates', time: '3 days ago', type: 'system' }
  ];

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const handlePasswordUpdate = () => {
    // Here you would typically update password
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-teal-500 to-purple-600 px-6 py-8 text-white rounded-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <motion.button
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Camera className="w-4 h-4" />
              </motion.button>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{profileData.fullName}</h2>
              <p className="text-white/90">{profileData.role}</p>
              <p className="text-white/80 text-sm">{profileData.department}</p>
            </div>
          </div>
          <motion.button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
            <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
          </motion.button>
        </div>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            ) : (
              <p className="text-gray-900">{profileData.fullName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            {isEditing ? (
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            ) : (
              <p className="text-gray-900">{profileData.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            {isEditing ? (
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            ) : (
              <p className="text-gray-900">{profileData.phone}</p>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            ) : (
              <p className="text-gray-900">{profileData.location}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            ) : (
              <p className="text-gray-900">{profileData.department}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
            <p className="text-gray-900">{profileData.joinDate}</p>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
        {isEditing ? (
          <textarea
            value={profileData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        ) : (
          <p className="text-gray-900 leading-relaxed">{profileData.bio}</p>
        )}
      </div>

      {/* Permissions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">Permissions</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {profileData.permissions.map((permission, index) => (
            <div key={index} className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-700 text-sm font-medium">{permission}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            onClick={handlePasswordUpdate}
            className="w-full px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors duration-300"
          >
            Update Password
          </button>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">Security Recommendations</h4>
            <ul className="text-sm text-yellow-700 mt-2 space-y-1">
              <li>• Use a strong password with at least 12 characters</li>
              <li>• Enable two-factor authentication for additional security</li>
              <li>• Regularly review your account activity</li>
              <li>• Never share your admin credentials</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferencesSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
            { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive browser push notifications' },
            { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Get weekly platform summary reports' },
            { key: 'securityAlerts', label: 'Security Alerts', desc: 'Immediate alerts for security events' },
            { key: 'maintenanceUpdates', label: 'Maintenance Updates', desc: 'Notifications about system maintenance' }
          ].map((pref) => (
            <div key={pref.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{pref.label}</h4>
                <p className="text-sm text-gray-600">{pref.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences[pref.key]}
                  onChange={(e) => handlePreferenceChange(pref.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select
              value={preferences.theme}
              onChange={(e) => handlePreferenceChange('theme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={preferences.language}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const sections = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'preferences', name: 'Preferences', icon: Settings }
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'security':
        return renderSecuritySection();
      case 'preferences':
        return renderPreferencesSection();
      default:
        return renderProfileSection();
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
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Admin Profile</h1>
          <p className="text-white/70">Manage your admin profile and account settings</p>
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
                  </div>
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-300 ${
                        activeSection === section.id
                          ? 'bg-teal-50 text-teal-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{section.name}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Recent Activity */}
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.slice(0, 3).map((activity, index) => (
                    <div key={index} className="text-xs">
                      <p className="text-gray-900 font-medium">{activity.action}</p>
                      <p className="text-gray-500">{activity.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm">
              {renderSectionContent()}
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
