import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Briefcase, 
  Heart,
  ArrowRight,
  Star,
  Building2,
  Eye,
  Target,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import SkillMatchingService from '../../../services/skillMatchingService.js';
import ApiService from '../../../services/apiService.js';
import Modal from '../../../components/ui/Modal.jsx';

const CandidateJobs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [salaryFilter, setSalaryFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [matchThreshold, setMatchThreshold] = useState(50);

  // State for API data
  const [candidateProfile, setCandidateProfile] = useState({ skills: [] });
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch candidate profile and jobs from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch candidate profile and job feed in parallel
        const [profileResponse, jobsResponse] = await Promise.all([
          ApiService.getCandidateProfile(),
          ApiService.getCandidateJobFeed()
        ]);

        setCandidateProfile(profileResponse);
        setAllJobs(jobsResponse);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Backend already returns skill-matched jobs, so use them directly
  const matchingJobs = allJobs.map(job => ({
    ...job,
    // Add skill match info for display purposes
    skillMatch: {
      matchPercentage: 85, // Placeholder - backend could provide this
      matchedSkills: job.skillsRequired || [],
      missingSkills: []
    }
  }));

  const filteredJobs = matchingJobs.filter(job => {
    const matchesSearch = (job.jobName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || (job.location || '').toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = !jobTypeFilter || (job.type || '').toLowerCase().replace('-', ' ') === jobTypeFilter.toLowerCase();
    return matchesSearch && matchesLocation && matchesType;
  });

  const toggleSaveJob = (jobId) => {
    // In a real app, this would make an API call
    console.log('Toggling save for job:', jobId);
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50';
    if (percentage >= 60) return 'text-blue-600 bg-blue-50';
    return 'text-orange-600 bg-orange-50';
  };

  const getMatchIcon = (percentage) => {
    if (percentage >= 80) return <CheckCircle className="w-4 h-4" />;
    if (percentage >= 60) return <Target className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const handleViewDetails = async (jobId) => {
    try {
      console.log('Viewing details for jobId:', jobId);
      
      if (!jobId || jobId === 'undefined') {
        throw new Error('Invalid job ID');
      }
      
      setLoading(true);
      const jobResponse = await ApiService.getJobDetails(jobId);
      if (!jobResponse || !jobResponse.job) throw new Error('Job details not found');
      setSelectedJobDetails(jobResponse.job);
      setShowDetailsModal(true);
    } catch (err) {
      console.error('Failed to load job details:', err);
      setError(err.message || 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedJobDetails(null);
  };

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
          <h1 className="text-2xl font-bold text-white mb-2">Find Jobs</h1>
          <p className="text-white/70">Discover your next career opportunity</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="bg-white rounded-xl p-4 sm:p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Job title or company..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="Location..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <select
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">All Job Types</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
            <motion.button
              className="bg-gradient-to-r from-teal-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium text-sm sm:text-base"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Search Jobs
            </motion.button>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-12"
          >
            <Loader2 className="w-8 h-8 animate-spin text-teal-500 mr-3" />
            <span className="text-white text-lg">Loading jobs...</span>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-400/20 rounded-xl p-6 text-center"
          >
            <div className="text-red-400 mb-2">⚠️ Error Loading Jobs</div>
            <p className="text-red-300 text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* Job Results */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-xl font-bold text-white">
              Available Jobs ({filteredJobs.length})
            </h2>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="text-white/70 text-sm">Sort by:</span>
              <select className="bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg px-3 py-2 text-sm flex-1 sm:flex-none">
                <option value="newest">Newest First</option>
                <option value="salary">Highest Salary</option>
                <option value="relevance">Most Relevant</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id || job._id || index}
                className={`bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 ${
                  job.featured ? 'border-2 border-teal-200 bg-teal-50/30' : 'border border-gray-200'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 space-y-2 sm:space-y-0">
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                              {job.jobName}
                              {job.featured && (
                                <Star className="inline w-4 h-4 text-yellow-500 ml-2" />
                              )}
                            </h3>
                            <p className="text-gray-600 font-medium">Company Name</p>
                          </div>
                          <motion.button
                            onClick={() => toggleSaveJob(job.id || job._id)}
                            className={`p-2 rounded-lg transition-colors duration-300 flex-shrink-0 ${
                              job.saved 
                                ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Heart className={`w-5 h-5 ${job.saved ? 'fill-current' : ''}`} />
                          </motion.button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            job.type === 'full-time' ? 'bg-blue-100 text-blue-700' :
                            job.type === 'contract' ? 'bg-purple-100 text-purple-700' :
                            job.type === 'part-time' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {job.type?.replace('-', ' ') || 'Full Time'}
                          </span>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>Remote</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-medium">₹</span>
                            <span>
                              {job.salary?.min && job.salary?.max 
                                ? `${job.salary.min}k-${job.salary.max}k`
                                : 'Salary not specified'
                              }
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                          <div className="flex flex-wrap gap-2">
                            {(job.skillsRequired || []).slice(0, 3).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                            {(job.skillsRequired || []).length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                +{(job.skillsRequired || []).length - 3} more
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                            <span className="text-sm text-gray-500 order-3 sm:order-1">
                              {job.applications || 0} applications
                            </span>
                            <motion.button
                              onClick={() => handleViewDetails(job.id || job._id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 w-full sm:w-auto order-2 sm:order-2"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Eye className="w-4 h-4" />
                              <span>View Details</span>
                            </motion.button>
                            <motion.button
                              onClick={() => navigate(`/dashboard/apply/${job.id || job._id}`)}
                              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 w-full sm:w-auto order-1 sm:order-3"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <span>Apply Now</span>
                              <ArrowRight className="w-4 h-4" />
                            </motion.button>
                            <div className={`flex items-center space-x-2 ${getMatchColor(job.skillMatch?.matchPercentage || 0)}`}>
                              {getMatchIcon(job.skillMatch?.matchPercentage || 0)}
                              <span className="text-sm">{job.skillMatch?.matchPercentage || 0}% Match</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Job Details Modal */}
          <Modal
            isOpen={showDetailsModal}
            onClose={closeDetailsModal}
            title={selectedJobDetails?.jobName || 'Job Details'}
            size="lg"
          >
            {selectedJobDetails ? (
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedJobDetails.jobName}</h3>
                    <p className="text-lg text-gray-700 font-medium">{selectedJobDetails.companyName || 'Company Name'}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedJobDetails.location || 'Remote'}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{selectedJobDetails.type?.replace('-', ' ') || 'Full Time'}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Posted {new Date(selectedJobDetails.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Salary Information */}
                {selectedJobDetails.salary && (selectedJobDetails.salary.min || selectedJobDetails.salary.max) && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                      <span className="mr-2">₹</span>
                      Salary Range
                    </h4>
                    <p className="text-green-700">
                      {selectedJobDetails.salary.min && selectedJobDetails.salary.max 
                        ? `₹${selectedJobDetails.salary.min.toLocaleString()} - ₹${selectedJobDetails.salary.max.toLocaleString()}`
                        : selectedJobDetails.salary.min 
                          ? `₹${selectedJobDetails.salary.min.toLocaleString()}+`
                          : `Up to ₹${selectedJobDetails.salary.max.toLocaleString()}`
                      }
                      {selectedJobDetails.salary.period && ` per ${selectedJobDetails.salary.period}`}
                    </p>
                  </div>
                )}

                {/* Job Description */}
                {selectedJobDetails.description && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Job Description</h4>
                    <div className="text-gray-700 leading-relaxed">
                      <p>{selectedJobDetails.description}</p>
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {selectedJobDetails.requirements && selectedJobDetails.requirements.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Requirements</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {selectedJobDetails.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Required Skills */}
                {selectedJobDetails.skillsRequired && selectedJobDetails.skillsRequired.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedJobDetails.skillsRequired.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefits */}
                {selectedJobDetails.benefits && selectedJobDetails.benefits.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Benefits & Perks</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {selectedJobDetails.benefits.map((benefit, i) => (
                        <li key={i}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  {selectedJobDetails.experienceLevel && (
                    <div>
                      <span className="font-medium text-gray-800">Experience Level:</span>
                      <p className="text-gray-600 capitalize">{selectedJobDetails.experienceLevel.replace('-', ' ')}</p>
                    </div>
                  )}
                  {selectedJobDetails.education && (
                    <div>
                      <span className="font-medium text-gray-800">Education:</span>
                      <p className="text-gray-600 capitalize">{selectedJobDetails.education.replace('-', ' ')}</p>
                    </div>
                  )}
                  {selectedJobDetails.applicationDeadline && (
                    <div>
                      <span className="font-medium text-gray-800">Application Deadline:</span>
                      <p className="text-gray-600">{new Date(selectedJobDetails.applicationDeadline).toLocaleDateString()}</p>
                    </div>
                  )}
                  {selectedJobDetails.recruiter && (
                    <div>
                      <span className="font-medium text-gray-800">Recruiter:</span>
                      <p className="text-gray-600">{selectedJobDetails.recruiter.name}</p>
                      {selectedJobDetails.recruiter.company && (
                        <p className="text-gray-500 text-sm">{selectedJobDetails.recruiter.company}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button 
                    onClick={closeDetailsModal} 
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => navigate(`/dashboard/apply/${selectedJobDetails.id || selectedJobDetails._id}`)} 
                    className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-600">Loading...</div>
            )}
          </Modal>

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
              <p className="text-gray-500">Try adjusting your search criteria or filters</p>
            </motion.div>
          )}
        </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CandidateJobs;
