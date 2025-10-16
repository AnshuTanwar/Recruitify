import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Briefcase, 
  Building2, 
  AlertTriangle,
  MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/layout/AdminLayout.jsx';
import ApiService from '../../../services/apiService.js';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [platformStats, setPlatformStats] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);

  // Fetch admin dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);


        // Fetch analytics summary, reports, and jobs
        const [summaryData, reportsData, jobsData] = await Promise.all([
          ApiService.getAdminAnalyticsSummary(),
          ApiService.getAdminReportSummary(),
          ApiService.getAdminJobs() // This now has internal fallback to mock data
        ]);

        // Transform API data to platform stats format
        if (summaryData?.totals) {
          const stats = [
            {
              title: 'Total Users',
              value: (summaryData.totals.candidates + summaryData.totals.recruiters).toLocaleString(),
              change: '+12%', // You can calculate this from trends data if available
              icon: Users,
              color: 'from-blue-500 to-blue-600',
              trend: 'up'
            },
            {
              title: 'Active Jobs',
              value: summaryData.totals.jobs.toLocaleString(),
              change: '+8%',
              icon: Briefcase,
              color: 'from-green-500 to-green-600',
              trend: 'up'
            },
            {
              title: 'Recruiters',
              value: summaryData.totals.recruiters.toLocaleString(),
              change: '+15%',
              icon: Building2,
              color: 'from-purple-500 to-purple-600',
              trend: 'up'
            },
            {
              title: 'Reports',
              value: summaryData.totals.reports.toLocaleString(),
              change: reportsData?.summary?.pending > 0 ? `${reportsData.summary.pending} pending` : 'All clear',
              icon: AlertTriangle,
              color: 'from-yellow-500 to-orange-500',
              trend: reportsData?.summary?.pending > 0 ? 'down' : 'up'
            }
          ];
          setPlatformStats(stats);
        }


        // Set recent jobs from backend data
        if (jobsData && Array.isArray(jobsData)) {
          setRecentJobs(jobsData.slice(0, 5));
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        
        // Handle authentication errors
        if (err.message.includes('Admin authentication required') || 
            err.message.includes('jwt malformed') || 
            err.message.includes('Unauthorized')) {
          setError('Admin authentication required. Please login as an admin.');
          // Optionally redirect to login after a delay
          setTimeout(() => {
            localStorage.clear();
            window.location.href = '/login';
          }, 3000);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);


  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="text-white">
            <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-white/70">Loading platform data...</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg bg-gray-200"></div>
                  <div className="w-12 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="w-20 h-3 bg-gray-200 rounded"></div>
                  <div className="w-16 h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="text-white">
            <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-white/70">Error loading platform data</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-red-700 font-medium">Failed to load dashboard data</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                {error.includes('Admin authentication required') && (
                  <p className="text-red-500 text-xs mt-2">Redirecting to login in 3 seconds...</p>
                )}
              </div>
            </div>
            {!error.includes('Admin authentication required') && (
              <button 
                onClick={() => window.location.reload()} 
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white"
        >
          <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-white/70">Platform overview and management tools</p>
        </motion.div>

        {/* Platform Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {platformStats.length > 0 ? (
            platformStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <span className={`text-sm font-medium ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">{stat.title}</p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            Array.from({ length: 4 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 border-2 border-dashed border-gray-200">
                  <div className="flex items-center justify-center h-20">
                    <p className="text-gray-400 text-sm">No data available</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>


        {/* Recent Job Postings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Job Postings</h2>
              <motion.button
                className="text-teal-600 hover:text-teal-700 font-medium"
                whileHover={{ x: 5 }}
                onClick={() => navigate('/admin/analytics')}
              >
                View All Jobs
              </motion.button>
            </div>

            <div className="space-y-4">
              {recentJobs.length > 0 ? recentJobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onClick={() => {
                    setSelectedJob(job);
                    setShowJobModal(true);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{job.jobName}</h3>
                          <p className="text-sm text-gray-600">
                            {job.type} • Experience: {job.experienceRequired} years
                          </p>
                          <p className="text-sm text-gray-500">
                            {job.salary?.min && job.salary?.max 
                              ? `₹${job.salary.min.toLocaleString()} - ₹${job.salary.max.toLocaleString()}${job.salary.yearly ? '/year' : ''}`
                              : 'Salary not specified'
                            }
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            job.status === 'open' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {job.status === 'open' ? 'Active' : 'Closed'}
                          </span>
                          <motion.button
                            className="p-1 text-gray-400 hover:text-gray-600"
                            whileHover={{ scale: 1.1 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedJob(job);
                              setShowJobModal(true);
                            }}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Job Data Available</h3>
                  <p className="text-gray-600 mb-4">
                    Admin users cannot access job data as the backend doesn't have admin-specific job endpoints.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                    <h4 className="font-medium text-blue-900 mb-2">Backend Limitation:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Job endpoints are role-protected (Recruiter/Candidate only)</li>
                      <li>• No admin job management endpoints exist</li>
                      <li>• Consider adding admin job endpoints to backend</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Job Details Modal */}
        {showJobModal && selectedJob && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Job Details</h2>
                  <button
                    onClick={() => setShowJobModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Job Title and Status */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedJob.jobName}</h3>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedJob.status === 'open' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {selectedJob.status === 'open' ? 'Active' : 'Closed'}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize">
                          {selectedJob.type}
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p><strong>Job ID:</strong> {selectedJob._id}</p>
                      <p><strong>Created:</strong> {new Date(selectedJob.createdAt).toLocaleDateString()}</p>
                      <p><strong>Updated:</strong> {new Date(selectedJob.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Complete Job Information Grid */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Complete Job Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Basic Details */}
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Job Name</label>
                          <p className="text-gray-900">{selectedJob.jobName}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-600">Job Type</label>
                          <p className="text-gray-900 capitalize">{selectedJob.type}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-600">Status</label>
                          <p className="text-gray-900 capitalize">{selectedJob.status}</p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-600">Experience Required</label>
                          <p className="text-gray-900">{selectedJob.experienceRequired} years</p>
                        </div>
                      </div>

                      {/* Salary & Recruiter Info */}
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Recruiter ID</label>
                          <p className="text-gray-900 font-mono text-sm">{selectedJob.recruiter}</p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-600">Salary Range</label>
                          <p className="text-gray-900">
                            {selectedJob.salary?.min && selectedJob.salary?.max 
                              ? `₹${selectedJob.salary.min.toLocaleString()} - ₹${selectedJob.salary.max.toLocaleString()}`
                              : 'Not specified'
                            }
                          </p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-600">Currency</label>
                          <p className="text-gray-900">{selectedJob.salary?.currency || 'INR'}</p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-600">Salary Type</label>
                          <p className="text-gray-900">{selectedJob.salary?.yearly ? 'Yearly' : 'Monthly'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Timestamps</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Created At</label>
                        <p className="text-gray-900">{new Date(selectedJob.createdAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Last Updated</label>
                        <p className="text-gray-900">{new Date(selectedJob.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Required Skills */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Required Skills</h4>
                    <div className="bg-white border rounded-lg p-4">
                      {selectedJob.skillsRequired && selectedJob.skillsRequired.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.skillsRequired.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No specific skills required</p>
                      )}
                    </div>
                  </div>

                  {/* Shortlisted Candidates */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Shortlisted Candidates</h4>
                    <div className="bg-white border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total Shortlisted:</span>
                        <span className="font-semibold text-gray-900">
                          {selectedJob.shortlistedCandidates?.length || 0} candidates
                        </span>
                      </div>
                      {selectedJob.shortlistedCandidates && selectedJob.shortlistedCandidates.length > 0 && (
                        <div className="mt-3 space-y-1">
                          <p className="text-sm text-gray-600">Candidate IDs:</p>
                          <div className="flex flex-wrap gap-1">
                            {selectedJob.shortlistedCandidates.map((candidateId, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-mono"
                              >
                                {candidateId}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Job Description */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Job Description</h4>
                    <div className="bg-white border rounded-lg p-4">
                      {selectedJob.description ? (
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedJob.description}</p>
                      ) : (
                        <p className="text-gray-500 italic">No description provided</p>
                      )}
                    </div>
                  </div>

                  {/* Raw Data (for debugging/admin purposes) */}
                  <div className="border-t pt-4">
                    <details className="group">
                      <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900">
                        View Raw Job Data (Admin Debug)
                      </summary>
                      <div className="mt-3 bg-gray-900 text-green-400 rounded-lg p-4 text-xs font-mono overflow-auto max-h-60">
                        <pre>{JSON.stringify(selectedJob, null, 2)}</pre>
                      </div>
                    </details>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      onClick={() => setShowJobModal(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setShowJobModal(false);
                        navigate('/admin/analytics');
                      }}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
                    >
                      View Analytics
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
