import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Settings, 
  Eye, 
  Trash2, 
  CheckCircle, 
  Target, 
  AlertCircle,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import ApiService from '../../../services/apiService.js';

const JobAlerts = () => {
  const navigate = useNavigate();
  const [alertSettings, setAlertSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    minMatchPercentage: 60,
    frequency: 'daily'
  });

  const [candidateProfile, setCandidateProfile] = useState({ skills: [] });
  const [jobAlerts, setJobAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch job alerts from backend
  useEffect(() => {
    const fetchJobAlerts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get candidate profile and job feed
        const [profileResponse, jobsResponse] = await Promise.all([
          ApiService.getCandidateProfile(),
          ApiService.getCandidateJobFeed()
        ]);

        setCandidateProfile(profileResponse);
        
        // Job feed already returns skill-matched jobs, so use them as alerts
        // Show only the 5 most recent jobs as alerts
        const recentAlerts = jobsResponse.slice(0, 5).map(job => ({
          ...job,
          id: job._id,
          title: job.jobName,
          company: 'Company Name', // Will be populated when job includes company info
          location: 'Remote',
          type: job.type?.replace('-', ' ') || 'full time',
          salary: job.salary ? `₹${job.salary.min}k-${job.salary.max}k` : 'Salary not specified',
          postedDate: new Date(job.createdAt).toLocaleDateString(),
          matchPercentage: 85 // Placeholder - backend could calculate this
        }));

        setJobAlerts(recentAlerts);
      } catch (err) {
        console.error('Error fetching job alerts:', err);
        setError(err.message || 'Failed to load job alerts');
      } finally {
        setLoading(false);
      }
    };

    fetchJobAlerts();
  }, []);

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  const getMatchIcon = (percentage) => {
    if (percentage >= 80) return <CheckCircle className="w-4 h-4" />;
    if (percentage >= 60) return <Target className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const handleDeleteAlert = (alertId) => {
    // In real app, this would make an API call
    console.log('Deleting alert:', alertId);
  };

  const handleViewJob = (jobId) => {
    navigate(`/dashboard/jobs/${jobId}`);
  };

  const handleApplyNow = (jobId) => {
    navigate(`/dashboard/apply/${jobId}`);
  };

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
            <h1 className="text-2xl font-bold text-white mb-2">Job Alerts</h1>
            <p className="text-white/70">Personalized job recommendations based on your skills</p>
          </div>
          <motion.button
            className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-white/20 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </motion.button>
        </motion.div>

        {/* Alert Settings Summary */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Alert Preferences</h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span>Min Match: {alertSettings.minMatchPercentage}%</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Frequency: {alertSettings.frequency}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Bell className="w-4 h-4" />
                  <span>Notifications: {alertSettings.emailNotifications ? 'On' : 'Off'}</span>
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Your Skills</h4>
              <div className="flex flex-wrap gap-2">
                {candidateProfile.skills.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {candidateProfile.skills.length > 4 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    +{candidateProfile.skills.length - 4} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Job Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              Recent Alerts ({jobAlerts.length})
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-white/70 text-sm">
                {jobAlerts.filter(alert => alert.isNew).length} new
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {jobAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                className={`bg-white rounded-xl p-6 shadow-sm border transition-all duration-300 ${
                  alert.isNew ? 'border-teal-200 bg-teal-50/30' : 'border-gray-200'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center space-x-3 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                              {alert.isNew && (
                                <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                                  New
                                </span>
                              )}
                              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getMatchColor(alert.matchPercentage)}`}>
                                {getMatchIcon(alert.matchPercentage)}
                                <span>{alert.matchPercentage}% Match</span>
                              </div>
                            </div>
                            <p className="text-gray-600 font-medium">{alert.company}</p>
                          </div>
                          <motion.button
                            onClick={() => handleDeleteAlert(alert.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            alert.type === 'Full Time' ? 'bg-blue-100 text-blue-700' :
                            alert.type === 'Contract' ? 'bg-purple-100 text-purple-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {alert.type}
                          </span>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{alert.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4" />
                            <span>{alert.salary}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{alert.postedDate}</span>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4 line-clamp-2">{alert.description}</p>

                        {/* Required Skills */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            <span className="text-sm font-medium text-gray-700">Required Skills:</span>
                             {(alert.requiredSkills || []).map((skill, idx) => {
                              const isMatched = candidateProfile.skills.some(candidateSkill => 
                                candidateSkill.toLowerCase().includes(skill.toLowerCase()) || 
                                skill.toLowerCase().includes(candidateSkill.toLowerCase())
                              );
                              return (
                                <span
                                  key={idx}
                                  className={`px-2 py-1 rounded text-xs font-medium ${
                                    isMatched 
                                      ? 'bg-green-100 text-green-700' 
                                      : 'bg-orange-100 text-orange-700'
                                  }`}
                                >
                                  {isMatched ? '✓' : ''} {skill}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                          <div className="text-sm text-gray-500">
                            Matched based on your skills in {candidateProfile.skills.join(', ')}
                          </div>
                          <div className="flex space-x-3 w-full sm:w-auto">
                            <motion.button
                              onClick={() => handleViewJob(alert.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 flex-1 sm:flex-none justify-center"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Eye className="w-4 h-4" />
                              <span>View</span>
                            </motion.button>
                            <motion.button
                              onClick={() => handleApplyNow(alert.id)}
                              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 flex-1 sm:flex-none justify-center"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <span>Apply Now</span>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Empty State */}
        {jobAlerts.length === 0 && (
          <motion.div
            className="bg-white rounded-xl p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No job alerts yet</h3>
            <p className="text-gray-500 mb-4">
              We'll notify you when jobs matching your skills become available
            </p>
            <motion.button
              onClick={() => navigate('/dashboard/profile')}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Update Your Skills
            </motion.button>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default JobAlerts;
