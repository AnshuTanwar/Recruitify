import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit, Trash2, Users, Calendar, MapPin, DollarSign, Plus, Search, Filter, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import RecruiterLayout from '../components/RecruiterLayout.jsx';
import ApiService from '../../../services/apiService.js';

const RecruiterJobs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, jobId: null, jobTitle: '' });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ApiService.getRecruiterJobs();
        setJobs(response);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError(err.message || 'Failed to load jobs');
        
        // No localStorage fallback - use empty array
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Map jobs to display format using exact backend data
  const jobsWithApplications = jobs.map(job => ({
    ...job,
    // Backend transforms _id to id, so we use job.id (not job._id)
    id: job.id || job._id, // fallback to _id if id doesn't exist
    title: job.jobName,
    company: job.companyName,
    applications: job.shortlistedCandidates?.length || 0,
    status: job.status === 'open' ? 'Active' : 'Closed',
    type: job.type?.replace('-', ' ') || 'full time',
    location: job.location || 'Location not specified',
    salary: job.salary?.min && job.salary?.max ? 
      `₹${job.salary.min.toLocaleString()}-${job.salary.max.toLocaleString()}/${job.salary.period || 'year'}` : 
      'Salary not specified',
    postedDate: new Date(job.createdAt).toLocaleDateString()
  }));

  const filteredJobs = jobsWithApplications.filter(job => {
    const matchesSearch = (job.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (job.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (job.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || job.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleDeleteJob = (jobId, jobTitle) => {
    setDeleteModal({ isOpen: true, jobId, jobTitle });
  };

  const confirmDelete = async () => {
    try {
      // Call backend API to delete job
      await ApiService.deleteJob(deleteModal.jobId);
      
      // Remove from local state
      const updatedJobs = jobs.filter(job => job.id !== deleteModal.jobId);
      setJobs(updatedJobs);
      
      // Job deleted successfully from backend
      
      setDeleteModal({ isOpen: false, jobId: null, jobTitle: '' });
    } catch (err) {
      console.error('Error deleting job:', err);
      // Backend delete failed, but still remove from local state
      const updatedJobs = jobs.filter(job => job._id !== deleteModal.jobId);
      setJobs(updatedJobs);
      setDeleteModal({ isOpen: false, jobId: null, jobTitle: '' });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, jobId: null, jobTitle: '' });
  };

  return (
    <RecruiterLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">My Jobs ({jobs.length})</h1>
            <p className="text-sm sm:text-base text-white/70">Manage your job postings and applications</p>
          </div>
          <Link to="/recruiter/post-job">
            <motion.button
              className="bg-gradient-to-r from-teal-500 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center space-x-2 shadow-lg shadow-teal-500/25 w-full sm:w-auto text-sm sm:text-base"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Post A Job</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          className="bg-white rounded-xl p-4 sm:p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search jobs by title or location..."
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            <div className="relative w-full sm:w-auto">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-auto pl-9 sm:pl-10 pr-8 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-12 bg-white rounded-xl"
          >
            <Loader2 className="w-8 h-8 animate-spin text-teal-500 mr-3" />
            <span className="text-gray-600 text-lg">Loading jobs...</span>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
          >
            <div className="text-red-600 mb-2">⚠️ Error Loading Jobs</div>
            <p className="text-red-500 text-sm mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* Jobs List */}
        {!loading && !error && (
          <motion.div
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
          {/* Table Header */}
          <div className="bg-gray-50 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-gray-200">
            <div className="hidden lg:grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
              <div className="col-span-4">JOB</div>
              <div className="col-span-2">DATE POSTED</div>
              <div className="col-span-2">STATUS</div>
              <div className="col-span-4">ACTION</div>
            </div>
            <div className="lg:hidden text-sm font-medium text-gray-600">
              My Job Listings
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                className="px-3 sm:px-4 lg:px-6 py-4 hover:bg-gray-50 transition-colors duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                {/* Desktop Layout */}
                <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                  {/* Job Info */}
                  <div className="col-span-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {job.title.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            job.type === 'Full Time' ? 'bg-blue-100 text-blue-700' :
                            job.type === 'Part Time' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {job.type}
                          </span>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3" />
                            <span>{job.salary}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date Applied */}
                  <div className="col-span-2">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>{job.postedDate}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                      <Users className="w-3 h-3" />
                      <span>{job.applications} applications</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${
                        job.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        job.status === 'Active' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    {job.daysRemaining > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {job.daysRemaining} days remaining
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-4">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        onClick={() => navigate(`/recruiter/jobs/${job.id}/applications`)}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition-colors duration-300 flex items-center space-x-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        View Applications
                      </motion.button>
                      <motion.button
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => navigate(`/recruiter/jobs/${job.id}/edit`)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteJob(job.id, job.title)}
                        className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="lg:hidden">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-xs sm:text-sm">
                        {job.title.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1 truncate text-sm sm:text-base">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              job.type === 'Full Time' ? 'bg-blue-100 text-blue-700' :
                              job.type === 'Part Time' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {job.type}
                            </span>
                            <div className="flex items-center space-x-1">
                              <div className={`w-2 h-2 rounded-full ${
                                job.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                              }`} />
                              <span className={`text-xs font-medium ${
                                job.status === 'Active' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {job.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 mb-3 space-y-1 sm:space-y-0">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3" />
                            <span>{job.salary}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{job.postedDate}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{job.applications} applications</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <motion.button
                          onClick={() => navigate(`/recruiter/jobs/${job.id}/applications`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-300 flex-1 sm:flex-none"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          View Applications
                        </motion.button>
                        <div className="flex space-x-2">
                          <motion.button
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => navigate(`/recruiter/jobs/${job.id}/edit`)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDeleteJob(job.id, job.title)}
                            className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredJobs.length === 0 && (
            <motion.div
              className="bg-white rounded-xl p-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
              <Link to="/recruiter/post-job">
                <motion.button
                  className="bg-gradient-to-r from-teal-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Post Your First Job
                </motion.button>
              </Link>
            </motion.div>
          )}
        </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Delete Job Post
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete "{deleteModal.jobTitle}"? This action cannot be undone and all applications will be permanently removed.
              </p>
              <div className="flex space-x-3">
                <motion.button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Delete Job
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterJobs;
