import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Shield, 
  Eye, 
  Settings as SettingsIcon, 
  Globe, 
  Lock,
  Smartphone,
  Mail,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Trash2,
  Download
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout.jsx';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    jobAlerts: true,
    messageNotifications: true,
    weeklyDigest: false,
    darkMode: false,
    soundEnabled: true,
    twoFactorAuth: false,
    profileVisibility: 'public',
    language: 'en'
  });

  const tabs = [
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield },
    { id: 'preferences', name: 'Preferences', icon: SettingsIcon },
    { id: 'account', name: 'Account Management', icon: Lock }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white"
        >
          <h1 className="text-2xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-white/70">Manage your preferences, privacy, and account settings</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 lg:sticky lg:top-6">
              <nav className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:space-y-1 lg:gap-0">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-center lg:justify-start space-x-2 px-2 sm:px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-center lg:text-left transition-all duration-300 text-xs sm:text-sm lg:text-base ${
                        activeTab === tab.id
                          ? 'bg-teal-50 text-teal-600 border border-teal-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium hidden lg:inline">{tab.name}</span>
                      <span className="font-medium lg:hidden">{tab.name.split(' ')[0]}</span>
                    </motion.button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 lg:p-6">
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    {/* Email Notifications */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-600" />
                        <div>
                          <h3 className="font-medium text-gray-900">Email Notifications</h3>
                          <p className="text-sm text-gray-500">Receive job alerts and updates via email</p>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.emailNotifications ? 'bg-teal-600' : 'bg-gray-200'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </motion.button>
                    </div>

                    {/* Push Notifications */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-5 h-5 text-gray-600" />
                        <div>
                          <h3 className="font-medium text-gray-900">Push Notifications</h3>
                          <p className="text-sm text-gray-500">Get instant notifications on your device</p>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => setSettings({...settings, pushNotifications: !settings.pushNotifications})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.pushNotifications ? 'bg-teal-600' : 'bg-gray-200'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </motion.button>
                    </div>

                    {/* Job Alerts */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <div>
                          <h3 className="font-medium text-gray-900">Job Alerts</h3>
                          <p className="text-sm text-gray-500">Notify me when new jobs match my preferences</p>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => setSettings({...settings, jobAlerts: !settings.jobAlerts})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.jobAlerts ? 'bg-teal-600' : 'bg-gray-200'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.jobAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </motion.button>
                    </div>

                    {/* Weekly Digest */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-600" />
                        <div>
                          <h3 className="font-medium text-gray-900">Weekly Digest</h3>
                          <p className="text-sm text-gray-500">Get a summary of your job search activity</p>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => setSettings({...settings, weeklyDigest: !settings.weeklyDigest})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.weeklyDigest ? 'bg-teal-600' : 'bg-gray-200'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.weeklyDigest ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy & Security</h2>
                  
                  <div className="space-y-4">
                    {/* Profile Visibility */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <Eye className="w-5 h-5 text-gray-600" />
                        <h3 className="font-medium text-gray-900">Profile Visibility</h3>
                      </div>
                      <select
                        value={settings.profileVisibility}
                        onChange={(e) => setSettings({...settings, profileVisibility: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="public">Public - Visible to all recruiters</option>
                        <option value="private">Private - Only visible when I apply</option>
                        <option value="hidden">Hidden - Not searchable</option>
                      </select>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-gray-600" />
                        <div>
                          <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => setSettings({...settings, twoFactorAuth: !settings.twoFactorAuth})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.twoFactorAuth ? 'bg-teal-600' : 'bg-gray-200'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </motion.button>
                    </div>

                    {/* Data Download */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Download className="w-5 h-5 text-gray-600" />
                          <div>
                            <h3 className="font-medium text-gray-900">Download Your Data</h3>
                            <p className="text-sm text-gray-500">Get a copy of all your account data</p>
                          </div>
                        </div>
                        <motion.button
                          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Download
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">App Preferences</h2>
                  
                  <div className="space-y-4">
                    {/* Dark Mode */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {settings.darkMode ? <Moon className="w-5 h-5 text-gray-600" /> : <Sun className="w-5 h-5 text-gray-600" />}
                        <div>
                          <h3 className="font-medium text-gray-900">Dark Mode</h3>
                          <p className="text-sm text-gray-500">Switch to dark theme</p>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => setSettings({...settings, darkMode: !settings.darkMode})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.darkMode ? 'bg-teal-600' : 'bg-gray-200'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </motion.button>
                    </div>

                    {/* Sound Effects */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {settings.soundEnabled ? <Volume2 className="w-5 h-5 text-gray-600" /> : <VolumeX className="w-5 h-5 text-gray-600" />}
                        <div>
                          <h3 className="font-medium text-gray-900">Sound Effects</h3>
                          <p className="text-sm text-gray-500">Play sounds for notifications and interactions</p>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => setSettings({...settings, soundEnabled: !settings.soundEnabled})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.soundEnabled ? 'bg-teal-600' : 'bg-gray-200'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </motion.button>
                    </div>

                    {/* Language */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <Globe className="w-5 h-5 text-gray-600" />
                        <h3 className="font-medium text-gray-900">Language</h3>
                      </div>
                      <select
                        value={settings.language}
                        onChange={(e) => setSettings({...settings, language: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'account' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Management</h2>
                  
                  <div className="space-y-4">
                    {/* Change Password */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Lock className="w-5 h-5 text-gray-600" />
                          <div>
                            <h3 className="font-medium text-gray-900">Change Password</h3>
                            <p className="text-sm text-gray-500">Update your account password</p>
                          </div>
                        </div>
                        <motion.button
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Change
                        </motion.button>
                      </div>
                    </div>

                    {/* Delete Account */}
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Trash2 className="w-5 h-5 text-red-600" />
                          <div>
                            <h3 className="font-medium text-red-900">Delete Account</h3>
                            <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                          </div>
                        </div>
                        <motion.button
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Delete
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <motion.button
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save Changes
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
