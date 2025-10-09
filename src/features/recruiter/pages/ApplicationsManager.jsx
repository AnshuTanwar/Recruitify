import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Eye, 
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Clock,
  Users,
  Loader2,
  ChevronDown,
  Download,
  TrendingUp
} from 'lucide-react';
import RecruiterLayout from '../components/RecruiterLayout.jsx';
import ApiService from '../../../services/apiService.js';

const ApplicationsManager = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [applications, setApplications] = useState([]);
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  // Fetch applications and job data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch job applications from backend
        const response = await ApiService.getJobApplications(jobId, {
          page: 1,
          limit: 100,
          sort: 'ats'
        });

        setApplications(response.applications || []);
        
        // Set job data from first application if available
        if (response.applications && response.applications.length > 0) {
          const firstApp = response.applications[0];
          setJobData({
            _id: jobId,
            jobName: firstApp.job?.jobName || 'Job Title',
            skillsRequired: firstApp.job?.skillsRequired || [],
            type: firstApp.job?.type || 'full-time',
            salary: firstApp.job?.salary || {}
          });
        } else {
          // Fallback job data if no applications
          setJobData({
            _id: jobId,
            jobName: 'Job Title',
            skillsRequired: [],
            type: 'full-time',
            salary: {}
          });
        }
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError(err.message || 'Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchData();
    }
  }, [jobId]);

  // Update application status
  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      setUpdatingStatus(applicationId);
      
      await ApiService.updateApplicationStatus(applicationId, {
        status: newStatus
      });
      
      // Update local state
      setApplications(prev => prev.map(app => 
        app._id === applicationId 
          ? { ...app, status: newStatus }
          : app
      ));
      
      console.log('Application status updated successfully');
    } catch (err) {
      console.error('Error updating application status:', err);
      alert('Failed to update application status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  // View applicant resume
  const viewResume = async (applicationId) => {
    try {
      const response = await ApiService.getApplicantResumeUrl(applicationId);
      window.open(response.url, '_blank');
    } catch (err) {
      console.error('Error viewing resume:', err);
      alert('Failed to load resume');
    }
  };

  // Get filtered applications
  const getFilteredApplications = () => {
    return applications.filter(app => {
      const matchesSearch = 
        (app.candidate?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.candidate?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  const filteredApplications = getFilteredApplications();

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shortlisted': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'interview': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'hired': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Get ATS score color
  const getATSScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    if (score >= 40) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const statusOptions = ['all', 'applied', 'shortlisted', 'interview', 'hired', 'rejected'];

  // Loading state
  if (loading) {
    return (
      <RecruiterLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500 mr-3" />
          <span className="text-white text-lg">Loading applications...</span>
        </div>
      </RecruiterLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <RecruiterLayout>
        <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-6 text-center">
          <div className="text-red-400 mb-2">⚠️ Error Loading Applications</div>
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
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => navigate('/recruiter/jobs')}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                {jobData?.jobName || 'Job Applications'}
              </h1>
              <p className="text-white/70 text-sm">
                {filteredApplications.length} applications found
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Applications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          {filteredApplications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredApplications.map((application, index) => (
                <motion.div
                  key={application._id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>

                      {/* Candidate Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {application.candidate?.fullName || 'Anonymous Candidate'}
                            </h3>
                            <p className="text-gray-600 text-sm flex items-center space-x-1">
                              <Mail className="w-4 h-4" />
                              <span>{application.candidate?.email || 'No email'}</span>
                            </p>
                          </div>

                          {/* ATS Score */}
                          {application.atsScore !== null && (
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getATSScoreColor(application.atsScore)}`}>
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="w-3 h-3" />
                                <span>{application.atsScore}% ATS</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Application Details */}
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Applied {new Date(application.createdAt).toLocaleDateString()}</span>
                          </div>
                          {application.candidate?.skills && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4" />
                              <span>{application.candidate.skills.length} skills</span>
                            </div>
                          )}
                        </div>

                        {/* Skills */}
                        {application.candidate?.skills && application.candidate.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {application.candidate.skills.slice(0, 5).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                            {application.candidate.skills.length > 5 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                +{application.candidate.skills.length - 5} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {/* Status Dropdown */}
                            <div className="relative">
                              <select
                                value={application.status}
                                onChange={(e) => updateApplicationStatus(application._id, e.target.value)}
                                disabled={updatingStatus === application._id}
                                className={`appearance-none border rounded-lg px-3 py-1 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 ${getStatusColor(application.status)} ${
                                  updatingStatus === application._id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                }`}
                              >
                                <option value="applied">Applied</option>
                                <option value="shortlisted">Shortlisted</option>
                                <option value="interview">Interview</option>
                                <option value="hired">Hired</option>
                                <option value="rejected">Rejected</option>
                              </select>
                              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-current w-3 h-3 pointer-events-none" />
                              {updatingStatus === application._id && (
                                <Loader2 className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 animate-spin" />
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2">
                            {/* View Resume Button */}
                            <motion.button
                              onClick={() => viewResume(application._id)}
                              className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FileText className="w-4 h-4" />
                              <span className="text-sm font-medium">Resume</span>
                            </motion.button>

                            {/* View Profile Button */}
                            <motion.button
                              className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Eye className="w-4 h-4" />
                              <span className="text-sm font-medium">Profile</span>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'No candidates have applied to this job yet'
                }
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </RecruiterLayout>
  );
};

export default ApplicationsManager;
