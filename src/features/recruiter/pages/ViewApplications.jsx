import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  MessageCircle, 
  CheckCircle, 
  X, 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  FileText,
  Star,
  Clock,
  Users,
  Building,
  Loader2,
  TrendingUp,
  ChevronDown
} from 'lucide-react';
import RecruiterLayout from '../components/RecruiterLayout.jsx';
import ApiService from '../../../services/apiService.js';

const ViewApplications = () => {
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
      case 'applied': return 'bg-blue-100 text-blue-700';
      case 'shortlisted': return 'bg-yellow-100 text-yellow-700';
      case 'interview': return 'bg-purple-100 text-purple-700';
      case 'hired': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
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

  const handleStatusChange = (applicationId, newStatus) => {
    // Update application status in localStorage
    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    const updatedJobs = appliedJobs.map(app => {
      if (app.id === applicationId) {
        return { ...app, status: newStatus };
      }
      return app;
    });
    localStorage.setItem('appliedJobs', JSON.stringify(updatedJobs));
    
    // Force re-render by updating the component
    window.location.reload();
  };

  const handleBulkAction = (action) => {
    // Bulk action performed successfully
  };

  return (
    <RecruiterLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => navigate(-1)}
              className="text-white hover:text-white/80 transition-colors"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold text-white">{jobData.title}</h1>
              <p className="text-white/70">{jobData.totalApplications} Applications</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total', value: jobData.totalApplications, color: 'from-blue-500 to-blue-600', icon: Users },
            { label: 'New', value: jobData.newApplications, color: 'from-green-500 to-green-600', icon: FileText },
            { label: 'Shortlisted', value: jobData.shortlisted, color: 'from-yellow-500 to-yellow-600', icon: Star },
            { label: 'Reviewed', value: jobData.reviewed, color: 'from-purple-500 to-purple-600', icon: MessageCircle },
            { label: 'Hired', value: jobData.hired, color: 'from-teal-500 to-teal-600', icon: CheckCircle }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Search and Filters */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or current role..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="reviewed">Reviewed</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {selectedApplications.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-700 font-medium">
                {selectedApplications.length} applications selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('shortlist')}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                >
                  Shortlist
                </button>
                <button
                  onClick={() => handleBulkAction('reject')}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  Reject
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Applications List */}
        <motion.div
          className="bg-white rounded-xl shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="divide-y divide-gray-200">
            {filteredApplications.map((application, index) => (
              <motion.div
                key={application.id}
                className="p-6 hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedApplications.includes(application.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedApplications([...selectedApplications, application.id]);
                        } else {
                          setSelectedApplications(selectedApplications.filter(id => id !== application.id));
                        }
                      }}
                      className="mt-1 w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                    />
                    
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{application.candidateName}</h3>
                          <p className="text-gray-600">{application.currentRole}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full border font-medium text-sm ${getStatusColor(application.status)}`}>
                          {application.status}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{application.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{application.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{application.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Briefcase className="w-4 h-4" />
                          <span className="text-sm">{application.experience}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <GraduationCap className="w-4 h-4" />
                          <span className="text-sm">{application.education}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">Applied {application.appliedDate}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {application.skills && application.skills.length > 0 ? (
                          application.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm italic">No skills listed</span>
                        )}
                      </div>
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
                        <div className="flex space-x-4 text-sm text-gray-600">
                          <span>Expected: {application.expectedSalary}</span>
                          <span>Available: {application.availability}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <select
                            value={application.status}
                            onChange={(e) => handleStatusChange(application.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          >
                            <option value="New">New</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Hired">Hired</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                          
                          <motion.button
                            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            title="View Resume"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          
                          <motion.button
                            className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            title="Download Resume"
                          >
                            <Download className="w-4 h-4" />
                          </motion.button>
                          
                          <motion.button
                            className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            title="Send Message"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </motion.button>
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
        {filteredApplications.length === 0 && (
          <motion.div
            className="bg-white rounded-xl p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </div>
    </RecruiterLayout>
  );
};

export default ViewApplications;
