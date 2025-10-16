import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Heart, Bell, ArrowRight, MapPin, DollarSign, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
import Card from '../../../components/ui/Card.jsx';
import ApiService from '../../../services/apiService.js';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // State for API data
  const [candidateProfile, setCandidateProfile] = useState({ fullName: '', skills: [] });
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend APIs
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch candidate profile and applications in parallel
        const [profileResponse, applicationsResponse] = await Promise.all([
          ApiService.getCandidateProfile(),
          ApiService.getCandidateApplications()
        ]);

        setCandidateProfile(profileResponse);
        setAppliedJobs(applicationsResponse);
        
        // For now, saved jobs will be empty until we implement favorites
        setSavedJobs([]);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: 'Applied Jobs',
      value: appliedJobs.length.toString(),
      icon: Briefcase,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Favorite Jobs',
      value: savedJobs.length.toString(),
      icon: Heart,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Profile Views',
      value: '0', // Will be implemented later with analytics
      icon: Bell,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  // Get recent applications (already populated from API)
  const recentApplications = appliedJobs.slice(0, 4).map(application => ({
    id: application._id,
    jobId: application.job._id,
    title: application.job?.jobName || 'Job Title Not Available',
    company: 'Company Name', // Will be populated when job includes recruiter info
    location: 'Remote', // Will be populated from job details
    type: application.job?.type || 'full-time',
    salary: application.job?.salary ? 
      `₹${application.job.salary.min}k-${application.job.salary.max}k` : 
      'Salary not specified',
    dateApplied: new Date(application.createdAt).toLocaleDateString(),
    status: application.status || 'applied',
    atsScore: application.atsScore
  }));

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500 mr-3" />
          <span className="text-white text-lg">Loading dashboard...</span>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
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
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white px-2 sm:px-0"
        >
          <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 leading-tight">{candidateProfile.fullName || 'Candidate'}</h1>
          <p className="text-xs xs:text-sm sm:text-base md:text-lg text-white/70">Here is your daily activities and job alerts</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6 mb-4 sm:mb-6 lg:mb-8 px-2 sm:px-0">
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

        {/* Profile Completion Alert */}
        <motion.div
          className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg sm:rounded-xl p-3 xs:p-4 sm:p-5 lg:p-6 text-white mx-2 sm:mx-0"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between space-y-3 xs:space-y-0 xs:space-x-3">
            <div className="flex items-start xs:items-center space-x-3 flex-1 min-w-0">
              <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <div className="w-4 h-4 xs:w-6 xs:h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-teal-500 to-purple-600"></div>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold mb-1 text-xs xs:text-sm sm:text-base lg:text-lg leading-tight">Your profile editing is not completed.</h3>
                <p className="text-white/90 text-xs xs:text-sm sm:text-base leading-tight">Complete your profile editing & build your custom Resume</p>
              </div>
            </div>
            <motion.button
              className="bg-white/20 hover:bg-white/30 px-3 xs:px-4 sm:px-5 lg:px-6 py-2 xs:py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 text-xs xs:text-sm w-full xs:w-auto flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard/profile')}
            >
              <span>Edit Profile</span>
              <ArrowRight className="w-3 h-3 xs:w-4 xs:h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* Recently Applied Jobs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="px-2 sm:px-0"
        >
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-3 sm:mb-4 lg:mb-6 space-y-2 xs:space-y-0">
            <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-white">Recently Applied</h2>
            <motion.button
              className="text-teal-400 hover:text-teal-300 font-medium flex items-center space-x-1 text-xs xs:text-sm sm:text-base"
              whileHover={{ x: 5 }}
              onClick={() => navigate('/dashboard/applied-jobs')}
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
                <div className="col-span-2">Date Applied</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-4">Action</div>
              </div>
              <div className="lg:hidden text-xs xs:text-sm font-medium text-gray-600">
                Recent Applications
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {recentApplications.length > 0 ? recentApplications.map((job, index) => (
                <motion.div
                  key={index}
                  className={`px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors duration-300 ${
                    job.highlighted ? 'border-2 border-blue-200 bg-blue-50/50' : ''
                  }`}
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
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              job.type === 'Remote' ? 'bg-green-100 text-green-700' :
                              job.type === 'Full Time' ? 'bg-blue-100 text-blue-700' :
                              job.type === 'Temporary' ? 'bg-yellow-100 text-yellow-700' :
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
                        <Clock className="w-3 h-3" />
                        <span>{job.dateApplied}</span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-green-600">{job.status}</span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="col-span-4">
                      <motion.button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/dashboard/applied-jobs')}
                      >
                        View Details
                      </motion.button>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="lg:hidden">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 mb-1 truncate text-sm sm:text-base">{job.title}</h3>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                job.type === 'Remote' ? 'bg-green-100 text-green-700' :
                                job.type === 'Full Time' ? 'bg-blue-100 text-blue-700' :
                                job.type === 'Temporary' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-purple-100 text-purple-700'
                              }`}>
                                {job.type}
                              </span>
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span className="text-xs font-medium text-green-600">{job.status}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 mb-3 space-y-1 sm:space-y-0">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{job.company}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{job.dateApplied.split(' ')[0]}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3" />
                            <span>{job.salary}</span>
                          </div>
                        </div>
                        <motion.button
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-colors duration-300"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate('/dashboard/applied-jobs')}
                        >
                          View Details
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="px-3 xs:px-4 sm:px-6 py-6 xs:py-8 text-center text-gray-500">
                  <Briefcase className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 mx-auto mb-3 xs:mb-4 text-gray-300" />
                  <p className="text-sm xs:text-base sm:text-lg font-medium mb-1 xs:mb-2">No applications yet</p>
                  <p className="text-xs xs:text-sm sm:text-base mb-3 xs:mb-4">Start applying to jobs to see your recent applications here</p>
                  <motion.button
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 rounded-lg text-xs xs:text-sm sm:text-base font-medium transition-colors duration-300 w-full xs:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/dashboard/jobs')}
                  >
                    Browse Jobs
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
