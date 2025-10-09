import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Edit, 
  Save,
  Camera,
  MapPin,
  Mail,
  Phone,
  Building2,
  Award,
  Users,
  TrendingUp,
  Briefcase,
  Loader2,
  X
} from 'lucide-react';
import RecruiterLayout from '../components/RecruiterLayout.jsx';
import ApiService from '../../../services/apiService.js';

const RecruiterProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Profile data from API
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    company: '',
    bio: ''
  });

  // Fetch profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const profile = await ApiService.getRecruiterProfile();
        setProfileData(profile);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Save profile data
  const handleSave = async () => {
    try {
      setSaving(true);
      await ApiService.updateRecruiterProfile(profileData);
      setSaving(false);
      setIsEditing(false);
      console.log('Profile saved successfully');
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Loading state
  if (loading) {
    return (
      <RecruiterLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500 mr-3" />
          <span className="text-white text-lg">Loading profile...</span>
        </div>
      </RecruiterLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <RecruiterLayout>
        <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-6 text-center">
          <div className="text-red-400 mb-2">⚠️ Error Loading Profile</div>
          <p className="text-red-300 text-sm mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </RecruiterLayout>
    );
  }

  const stats = [
    { title: 'Active Jobs', value: '0', icon: Briefcase, color: 'text-blue-600 bg-blue-50' },
    { title: 'Total Applications', value: '0', icon: Users, color: 'text-green-600 bg-green-50' },
    { title: 'Hired Candidates', value: '0', icon: Award, color: 'text-purple-600 bg-purple-50' },
    { title: 'Profile Views', value: '0', icon: TrendingUp, color: 'text-orange-600 bg-orange-50' }
  ];

  return (
    <RecruiterLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Recruiter Profile</h1>
            <p className="text-white/70">Manage your professional information</p>
          </div>
          <motion.button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={saving}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
              isEditing 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-white/10 hover:bg-white/20 text-white'
            } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            whileHover={{ scale: saving ? 1 : 1.05 }}
            whileTap={{ scale: saving ? 1 : 0.95 }}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isEditing ? (
              <Save className="w-4 h-4" />
            ) : (
              <Edit className="w-4 h-4" />
            )}
            <span>{saving ? 'Saving...' : isEditing ? 'Save Profile' : 'Edit Profile'}</span>
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              className="bg-white rounded-xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>
            
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profileData.fullName || 'Not specified'}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="flex items-center space-x-2 text-gray-600 py-2">
                  <Mail className="w-4 h-4" />
                  <span>{profileData.email || 'Not specified'}</span>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-gray-600 py-2">
                    <Phone className="w-4 h-4" />
                    <span>{profileData.phone || 'Not specified'}</span>
                  </div>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter your location"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-gray-600 py-2">
                    <MapPin className="w-4 h-4" />
                    <span>{profileData.location || 'Not specified'}</span>
                  </div>
                )}
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter your company name"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-gray-600 py-2">
                    <Building2 className="w-4 h-4" />
                    <span>{profileData.company || 'Not specified'}</span>
                  </div>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Tell us about yourself and your recruiting experience..."
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profileData.bio || 'No bio provided'}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Profile Picture */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                  <User className="w-16 h-16 text-white" />
                </div>
                <motion.button
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 mx-auto"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Camera className="w-4 h-4" />
                  <span>Change Photo</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterProfile;
