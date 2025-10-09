import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, Calendar, TrendingUp, Eye, MessageSquare, Clock, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RecruiterLayout from '../components/RecruiterLayout.jsx';
import ApiService from '../../../services/apiService.js';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  
  // State for API data
  const [recruiterProfile, setRecruiterProfile] = useState({ fullName: '', company: '' });
  const [postedJobs, setPostedJobs] = useState([]);
  const [totalApplications, setTotalApplications] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend APIs
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch recruiter profile and jobs in parallel
        const [profileResponse, jobsResponse] = await Promise.all([
          ApiService.getRecruiterProfile(),
          ApiService.getRecruiterJobs()
        ]);

        setRecruiterProfile(profileResponse);
        setPostedJobs(jobsResponse);
        
        // Get total applications count more efficiently
        try {
          const applicationsResponse = await ApiService.getRecruiterApplications();
          setTotalApplications(applicationsResponse.count || 0);
        } catch (err) {
          console.warn('Failed to fetch applications count:', err);
          setTotalApplications(0);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate active jobs
  const activeJobs = postedJobs.filter(job => job.status === 'open').length;

  const stats = [
    {
      title: 'Open Jobs',
      value: activeJobs.toString(),
      icon: Briefcase,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Applications',
      value: totalApplications.toString(),
      icon: Users,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50'
    }
  ];

  // Recent jobs with proper status mapping
  const recentJobs = postedJobs.slice(0, 5).map(job => ({
    ...job,
    id: job._id,
    title: job.jobName,
    applications: 0, // Will be populated by individual API calls if needed
    status: job.status === 'open' ? 'Active' : 'Closed',
    statusColor: job.status === 'open' ? 'text-green-600' : 'text-red-600',
    bgColor: job.status === 'open' ? 'bg-green-50' : 'bg-red-50',
    type: job.type?.replace('-', ' ') || 'full time',
    location: 'Remote', // Will be added to job model later
    postedDate: new Date(job.createdAt).toLocaleDateString()
  }));

  // Loading state
  if (loading) {
    return (
      <RecruiterLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500 mr-3" />
          <span className="text-white text-lg">Loading dashboard...</span>
        </div>
      </RecruiterLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <RecruiterLayout>
        <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-6 text-center">
          <div className="text-red-400 mb-2">⚠️ Error Loading Dashboard</div>
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
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white px-2 sm:px-0"
        >
          <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 leading-tight">Hello, {recruiterProfile.fullName || 'Recruiter'}</h1>
          <p className="text-xs xs:text-sm sm:text-base md:text-lg text-white/70">Here's your recruiting dashboard and job posting analytics</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4 sm:gap-6 mb-4 sm:mb-6 lg:mb-8 px-2 sm:px-0">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="bg-white rounded-lg sm:rounded-xl p-3 xs:p-4 sm:p-5 lg:p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-600 text-xs xs:text-sm font-medium mb-1 truncate">{stat.title}</p>
                      <p className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center flex-shrink-0 ml-2`}>
                      <Icon className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Recently Posted Jobs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="px-2 sm:px-0"
        >
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-3 sm:mb-4 lg:mb-6 space-y-2 xs:space-y-0">
            <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-white">Recently Posted Jobs</h2>
            <motion.button
              className="text-teal-400 hover:text-teal-300 font-medium flex items-center space-x-1 text-xs xs:text-sm sm:text-base"
              whileHover={{ x: 5 }}
              onClick={() => navigate('/recruiter/jobs')}
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3 xs:w-4 xs:h-4" />
            </motion.button>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 px-3 xs:px-4 sm:px-5 lg:px-6 py-3 xs:py-3.5 sm:py-4 border-b border-gray-200">
              <div className="hidden lg:grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
                <div className="col-span-4">JOBS</div>
                <div className="col-span-2">STATUS</div>
                <div className="col-span-2">APPLICATIONS</div>
                <div className="col-span-4">ACTIONS</div>
              </div>
              <div className="lg:hidden text-xs xs:text-sm font-medium text-gray-600">
                Recent Job Postings
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {recentJobs.length > 0 ? recentJobs.map((job, index) => (
                <motion.div
                  key={index}
                  className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {/* Desktop Layout */}
                  <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                    {/* Job Info */}
                    <div className="col-span-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              job.type === 'Full Time' ? 'bg-blue-100 text-blue-700' :
                              job.type === 'Part Time' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {job.type}
                            </span>
                            <span>• {job.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${
                          job.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <span className={`text-sm font-medium ${job.statusColor}`}>
                          {job.status}
                        </span>
                      </div>
                      {job.daysRemaining > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {job.daysRemaining} days remaining
                        </p>
                      )}
                    </div>

                    {/* Applications */}
                    <div className="col-span-2">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {job.applications} Applications
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-4">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/recruiter/jobs/${job.id}/applications`)}
                        >
                          View Applications
                        </motion.button>
                        <motion.button
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate('/recruiter/jobs')}
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="lg:hidden">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 mb-1 truncate">{job.title}</h3>
                            <div className="flex items-center space-x-2 mb-2">
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
                                <span className={`text-xs font-medium ${job.statusColor}`}>
                                  {job.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <div className="flex items-center space-x-3">
                            <span>{job.location}</span>
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{job.applications}</span>
                            </div>
                          </div>
                          {job.daysRemaining > 0 && (
                            <span>{job.daysRemaining} days left</span>
                          )}
                        </div>
                        <motion.button
                          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate(`/recruiter/jobs/${job.id}/applications`)}
                        >
                          View Applications
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="px-3 xs:px-4 sm:px-6 py-6 xs:py-8 text-center text-gray-500">
                  <Briefcase className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 mx-auto mb-3 xs:mb-4 text-gray-300" />
                  <p className="text-sm xs:text-base sm:text-lg font-medium mb-1 xs:mb-2">No jobs posted yet</p>
                  <p className="text-xs xs:text-sm sm:text-base mb-3 xs:mb-4">Start posting jobs to see your dashboard analytics</p>
                  <motion.button
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 rounded-lg text-xs xs:text-sm sm:text-base font-medium transition-colors duration-300 w-full xs:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/recruiter/post-job')}
                  >
                    Post Your First Job
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterDashboard;
