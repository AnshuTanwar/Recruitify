import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Shield, 
  User, 
  Trash2, 
  Eye, 
  EyeOff, 
  Globe, 
  Briefcase,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Target,
  Award,
  Settings as SettingsIcon
} from 'lucide-react';
import RecruiterLayout from '../components/RecruiterLayout.jsx';

const RecruiterSettings = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [showPassword, setShowPassword] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    // Notification settings
    emailNotifications: true,
    applicationAlerts: true,
    candidateMessages: true,
    jobExpiryReminders: true,
    weeklyReports: false,
    marketingEmails: false,
    
    // Privacy settings
    profileVisibility: 'public',
    showCompanyInfo: true,
    showContactInfo: false,
    allowDirectMessages: true,
    showJobHistory: true,
    
    // Recruitment preferences
    autoRejectAfterDays: 30,
    requireCoverLetter: false,
    allowRemoteApplications: true,
    preferredCommunication: 'email',
    workingHours: '9am-6pm',
    timezone: 'PST',
    
    // Account settings
    twoFactorAuth: false,
    sessionTimeout: 60,
    darkMode: false,
    language: 'English'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'preferences', label: 'Recruitment', icon: Target },
    { id: 'account', label: 'Account', icon: User }
  ];

  const renderNotifications = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email notifications', desc: 'Receive email updates about your account' },
            { key: 'applicationAlerts', label: 'New applications', desc: 'Get notified when candidates apply to your jobs' },
            { key: 'candidateMessages', label: 'Candidate messages', desc: 'Receive emails when candidates send you messages' },
            { key: 'jobExpiryReminders', label: 'Job expiry reminders', desc: 'Get reminded before your job posts expire' },
            { key: 'weeklyReports', label: 'Weekly reports', desc: 'Receive weekly analytics and performance reports' },
            { key: 'marketingEmails', label: 'Marketing emails', desc: 'Receive updates about new features and tips' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[item.key]}
                  onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Visibility</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile visibility</label>
            <select
              value={settings.profileVisibility}
              onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="public">Public - Visible to all candidates</option>
              <option value="limited">Limited - Only visible to applicants</option>
              <option value="private">Private - Not visible to candidates</option>
            </select>
          </div>

          {[
            { key: 'showCompanyInfo', label: 'Show company information', desc: 'Display your company details on your profile' },
            { key: 'showContactInfo', label: 'Show contact information', desc: 'Allow candidates to see your contact details' },
            { key: 'allowDirectMessages', label: 'Allow direct messages', desc: 'Let candidates message you directly' },
            { key: 'showJobHistory', label: 'Show job posting history', desc: 'Display your previous job postings' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[item.key]}
                  onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recruitment Preferences</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Auto-reject applications after (days)</label>
            <select
              value={settings.autoRejectAfterDays}
              onChange={(e) => handleSettingChange('autoRejectAfterDays', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={0}>Never</option>
            </select>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred communication method</label>
            <select
              value={settings.preferredCommunication}
              onChange={(e) => handleSettingChange('preferredCommunication', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="platform">Platform messages</option>
            </select>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Working hours</label>
            <input
              type="text"
              value={settings.workingHours}
              onChange={(e) => handleSettingChange('workingHours', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g., 9am-6pm"
            />
          </div>

          {[
            { key: 'requireCoverLetter', label: 'Require cover letter', desc: 'Make cover letters mandatory for all applications' },
            { key: 'allowRemoteApplications', label: 'Allow remote applications', desc: 'Accept applications from remote candidates' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[item.key]}
                  onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAccount = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Two-factor authentication</p>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Session timeout (minutes)</label>
            <select
              value={settings.sessionTimeout}
              onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={0}>Never</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Dark mode</p>
              <p className="text-sm text-gray-600">Switch to dark theme</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-red-600">Danger Zone</h3>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-900">Delete Account</p>
              <p className="text-sm text-red-700">Permanently delete your recruiter account and all associated data</p>
            </div>
            <motion.button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Trash2 className="w-4 h-4 mr-2 inline" />
              Delete Account
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'notifications':
        return renderNotifications();
      case 'privacy':
        return renderPrivacy();
      case 'preferences':
        return renderPreferences();
      case 'account':
        return renderAccount();
      default:
        return renderNotifications();
    }
  };

  return (
    <RecruiterLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-3"
        >
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <SettingsIcon className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Recruiter Settings</h1>
            <p className="text-white/70">Manage your recruitment preferences and account settings</p>
          </div>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          className="bg-white rounded-xl shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200">
              <div className="p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-teal-100 text-teal-700 border border-teal-200'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        whileHover={{ x: 5 }}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </motion.button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderTabContent()}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          className="flex justify-end"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Save Changes
          </motion.button>
        </motion.div>
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterSettings;
