import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, DollarSign, Calendar, Briefcase, GraduationCap, X, CheckCircle, ArrowLeft, Clock } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import RecruiterLayout from '../components/RecruiterLayout.jsx';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';
import ApiService from '../../../services/apiService.js';

const PostJob = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    location: '',
    jobType: '',
    minSalary: '',
    maxSalary: '',
    salaryType: '',
    experience: '',
    education: '',
    jobDescription: '',
    requirements: '',
    requiredSkills: [],
    benefits: '',
    applicationDeadline: '',
    contactEmail: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Prepare job data for backend API
      const jobData = {
        jobName: formData.jobTitle,
        description: formData.jobDescription,
        skillsRequired: formData.requiredSkills,
        experienceRequired: parseInt(formData.experience) || 0,
        salary: {
          min: parseInt(formData.minSalary) || null,
          max: parseInt(formData.maxSalary) || null,
          currency: 'USD',
          yearly: formData.salaryType === 'Yearly'
        },
        type: formData.jobType.toLowerCase().replace(' ', '-') || 'full-time'
      };

      // Call backend API to create job
      const response = await ApiService.createJob(jobData);
      
      console.log('Job posted successfully:', response);
    } catch (error) {
      console.error('Error posting job:', error);
      // Show error to user
      setError(error.message || 'Failed to post job');
      return; // Don't proceed with success actions
    }
    
    setIsSubmitting(false);
    
    // Reset form
    setFormData({
      jobTitle: '',
      company: '',
      location: '',
      jobType: '',
      minSalary: '',
      maxSalary: '',
      salaryType: '',
      experience: '',
      education: '',
      jobDescription: '',
      requirements: '',
      requiredSkills: [],
      benefits: '',
      applicationDeadline: '',
      contactEmail: ''
    });
    
    // Show success message
    setShowSuccess(true);
    
    // Hide success message and navigate after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/recruiter/jobs');
    }, 3000);
  };

  const jobTypes = ['Full Time', 'Part Time', 'Contract', 'Temporary', 'Internship'];
  const salaryTypes = ['Monthly', 'Yearly', 'Hourly'];
  const experienceLevels = ['Entry Level', '1-2 years', '3-5 years', '5+ years', 'Senior Level'];
  const educationLevels = ['High School', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Any'];

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.requiredSkills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <RecruiterLayout>
      <div className="space-y-6">
        {/* Success Message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3"
          >
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="font-semibold">Job Posted Successfully!</p>
              <p className="text-sm opacity-90">Redirecting to your jobs...</p>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center space-x-4"
        >
          <Link to="/recruiter/dashboard">
            <motion.button
              className="p-2 rounded-lg bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Post a Job</h1>
            <p className="text-white/70">Fill out the form to post a new job opening</p>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-400/20 rounded-xl p-4 text-center"
          >
            <div className="text-red-400 mb-2">⚠️ Error Posting Job</div>
            <p className="text-red-300 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Job Posting Form */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 xl:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 lg:mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-sm"
                    placeholder="e.g. Senior Frontend Developer"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-sm"
                    placeholder="Company name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="e.g. San Francisco, CA"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                  <select
                    value={formData.jobType}
                    onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                    className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-sm"
                    required
                  >
                    <option value="">Select job type</option>
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Salary Information */}
            <div>
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 lg:mb-6">Salary Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Salary</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.minSalary}
                      onChange={(e) => setFormData({ ...formData, minSalary: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="50000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Salary</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.maxSalary}
                      onChange={(e) => setFormData({ ...formData, maxSalary: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="80000"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary Type</label>
                  <select
                    value={formData.salaryType}
                    onChange={(e) => setFormData({ ...formData, salaryType: e.target.value })}
                    className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-sm"
                  >
                    <option value="">Select type</option>
                    {salaryTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Advanced Information */}
            <div>
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 lg:mb-6">Advanced Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-sm"
                  >
                    <option value="">Select experience</option>
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                  <select
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-sm"
                  >
                    <option value="">Select education</option>
                    {educationLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.applicationDeadline}
                      onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Required Skills */}
            <div>
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 lg:mb-6">Required Skills</h2>
              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-sm"
                    placeholder="Add a required skill"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 sm:py-3 bg-teal-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.requiredSkills.map((skill, index) => (
                    <div key={index} className="bg-gray-100 rounded-lg px-3 py-2 text-sm flex items-center space-x-2">
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div>
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 lg:mb-6">Job Details</h2>
              <div className="space-y-4 lg:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                  <textarea
                    value={formData.jobDescription}
                    onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 resize-none text-sm"
                    placeholder="Describe the job role, responsibilities, and what you're looking for..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                  <textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 resize-none text-sm"
                    placeholder="List the required skills, qualifications, and experience..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
                  <textarea
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 resize-none text-sm"
                    placeholder="Health insurance, flexible hours, remote work options..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 lg:pt-6 border-t border-gray-200">
              <Link to="/recruiter/dashboard">
                <motion.button
                  type="button"
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </Link>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 bg-gradient-to-r from-teal-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 disabled:opacity-50 text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <motion.div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Publishing...</span>
                  </div>
                ) : (
                  'Publish Job'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </RecruiterLayout>
  );
};

export default PostJob;
