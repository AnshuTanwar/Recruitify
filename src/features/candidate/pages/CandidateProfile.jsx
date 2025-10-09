import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Upload, 
  FileText, 
  Trash2, 
  Edit, 
  Save,
  Camera,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  GraduationCap,
  Eye,
  Loader2
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import ApiService from '../../../services/apiService.js';

const CandidateProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeError, setResumeError] = useState(null);
  
  // Profile data from API
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    experience: 0,
    bio: '',
    skills: [],
    resumes: []
  });

  // Fetch profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const profile = await ApiService.getCandidateProfile();
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

  // Use resumes from profile data
  const resumes = profileData.resumes || [];

  // Handle resume upload
  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setResumeError('Please upload only PDF, DOC, or DOCX files');
      return;
    }

    // Validate file size (5MB limit as per backend)
    if (file.size > 5 * 1024 * 1024) {
      setResumeError('File size must be less than 5MB');
      return;
    }

    try {
      setUploadingResume(true);
      setResumeError(null);

      const formData = new FormData();
      formData.append('resume', file);

      const response = await ApiService.uploadResume(formData);
      
      // Refresh profile data to get updated resumes
      const updatedProfile = await ApiService.getCandidateProfile();
      setProfileData(updatedProfile);
      
      console.log('Resume uploaded successfully:', response);
    } catch (err) {
      console.error('Error uploading resume:', err);
      
      // Provide specific error messages for common issues
      let errorMessage = 'Failed to upload resume';
      if (err.message.includes('entity too large') || err.message.includes('413')) {
        errorMessage = 'File is too large. Please choose a file smaller than 5MB.';
      } else if (err.message.includes('network') || err.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (err.message.includes('timeout')) {
        errorMessage = 'Upload timed out. Please try again with a smaller file.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setResumeError(errorMessage);
    } finally {
      setUploadingResume(false);
      // Reset file input
      event.target.value = '';
    }
  };

  // Handle resume deletion
  const handleResumeDelete = async (resumeKey) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    try {
      // clean up the key (remove any 'resumes/' prefix)

      await ApiService.deleteResume(resumeKey);

      // Refresh profile data after deletion
      const updatedProfile = await ApiService.getCandidateProfile();
      setProfileData(updatedProfile);

      console.log("Resume deleted successfully ✅");
    } catch (err) {
      console.error("Error deleting resume:", err);
      setResumeError(err.message || "Failed to delete resume");
    }
  };


  // Handle resume view/download
  const handleResumeView = async (resumeKey) => {
    try {
      const response = await ApiService.getResumeUrl(resumeKey);
      window.open(response.url, '_blank');
    } catch (err) {
      console.error('Error viewing resume:', err);
      setResumeError(err.message || 'Failed to view resume');
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await ApiService.updateCandidateProfile(profileData);
      setIsEditing(false);
      console.log('Profile saved successfully');
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() !== '' && !profileData.skills.includes(newSkill.trim())) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500 mr-3" />
          <span className="text-white text-lg">Loading profile...</span>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
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
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">My Profile</h1>
            <p className="text-white/70">Manage your professional profile and resume</p>
          </div>
          <motion.button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={saving}
            className="bg-gradient-to-r from-teal-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isEditing ? (
              <Save className="w-5 h-5" />
            ) : (
              <Edit className="w-5 h-5" />
            )}
            <span>
              {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
            </span>
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Basic Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 bg-white"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  {profileData.email ? (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{profileData.email}</p>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">From Account</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <p className="text-blue-800 text-sm">Please login again to load your email</p>
                      </div>
                      <button
                        onClick={() => {
                          localStorage.clear();
                          window.location.href = '/login';
                        }}
                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                      >
                        Login
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 bg-white"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{profileData.phone}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 bg-white"
                      placeholder="Enter your location"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{profileData.location}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  {isEditing ? (
                    <select
                      value={profileData.experience}
                      onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 bg-white"
                    >
                      <option value="0-1 years">0-1 years</option>
                      <option value="1-3 years">1-3 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="5+ years">5+ years</option>
                    </select>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{profileData.experience}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none text-gray-900 bg-white"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
                )}
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Skills</h2>
              
              {/* Skills Display */}
              <div className="flex flex-wrap gap-2 mb-4">
                {profileData.skills.map((skill, index) => (
                  <motion.div
                    key={skill}
                    className="flex items-center space-x-2 bg-teal-50 text-teal-700 px-3 py-2 rounded-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <span className="text-sm font-medium">{skill}</span>
                    {isEditing && (
                      <motion.button
                        onClick={() => handleSkillRemove(skill)}
                        className="text-teal-600 hover:text-red-600 transition-colors duration-300"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Add New Skill Input */}
              {isEditing && (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a skill (press Enter)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm text-gray-900 bg-white"
                  />
                  <motion.button
                    onClick={handleAddSkill}
                    className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add
                  </motion.button>
                </div>
              )}

              {/* Empty State */}
              {profileData.skills.length === 0 && !isEditing && (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <GraduationCap className="w-12 h-12 mx-auto" />
                  </div>
                  <p className="text-gray-500 text-sm">No skills added yet</p>
                  <p className="text-gray-400 text-xs">Click "Edit Profile" to add your skills</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Profile Picture and Resume */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Profile Picture */}
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

            {/* Resume Management */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume/CV</h3>
              
              {/* Resume Error */}
              {resumeError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4"
                >
                  <p className="text-red-600 text-sm">{resumeError}</p>
                </motion.div>
              )}
              
              <div className="space-y-3">
                {resumes.length > 0 ? resumes.map((resume, index) => (
                  <motion.div
                    key={resume._id || resume.key || index}
                    className="border rounded-lg p-4 border-gray-200 hover:border-teal-200 transition-colors duration-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{resume.originalName || 'Resume'}</p>
                          <p className="text-xs text-gray-500">
                            Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <motion.button
                          onClick={() => handleResumeView(resume.key || resume._id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-300 rounded-lg hover:bg-blue-50"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          title="View Resume"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleResumeDelete(resume.key || resume._id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-300 rounded-lg hover:bg-red-50"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          title="Delete Resume"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No resumes uploaded yet</p>
                    <p className="text-gray-400 text-xs">Upload your first resume to get started</p>
                  </div>
                )}
              </div>

              {/* Upload Area */}
              {resumes.length < 3 && (
                <motion.div
                  className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-400 transition-colors duration-300 cursor-pointer relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    disabled={uploadingResume}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {uploadingResume ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
                      <span className="text-sm font-medium text-teal-600">Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-700">Upload New Resume</p>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 5MB</p>
                      <p className="text-xs text-gray-400 mt-1">({3 - resumes.length} remaining)</p>
                    </>
                  )}
                </motion.div>
              )}
              
              {resumes.length >= 3 && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-700 text-sm text-center">
                    Maximum 3 resumes allowed. Delete one to upload a new resume.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CandidateProfile;
