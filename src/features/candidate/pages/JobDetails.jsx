import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Calendar,
  Building,
  Briefcase,
  GraduationCap,
  Star,
  Heart,
  Share2,
  ArrowLeft,
  CheckCircle,
  Loader2
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import ApiService from '../../../services/apiService.js';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch job data from candidate job feed
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get job from candidate job feed
        const jobsResponse = await ApiService.getCandidateJobFeed();
        const foundJob = jobsResponse.find(job => job._id === id);
        
        if (foundJob) {
          setJob({
            ...foundJob,
            requirements: foundJob.requirements || [],
            responsibilities: foundJob.responsibilities || [],
            benefits: foundJob.benefits || [],
            skills: foundJob.skillsRequired || [],
            applicants: 0, // Will be populated if needed
            posted: new Date(foundJob.createdAt).toLocaleDateString(),
            experience: foundJob.experienceRequired || 'Not specified',
            education: 'Not specified' // Will be added to job model if needed
          });
        } else {
          throw new Error('Job not found or not available for your skill set');
        }
      } catch (err) {
        console.error('Error fetching job data:', err);
        setError(err.message || 'Failed to load job data');
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [id]);

  const handleApplyNow = () => {
    navigate(`/dashboard/apply/${job._id}`);
  };

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500 mr-3" />
          <span className="text-white text-lg">Loading job details...</span>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error || !job) {
    return (
      <DashboardLayout>
        <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-6 text-center">
          <div className="text-red-400 mb-2">⚠️ Job Not Found</div>
          <p className="text-red-300 text-sm mb-4">{error || 'The job you\'re looking for doesn\'t exist or is not available for your skill set.'}</p>
          <motion.button
            onClick={() => navigate('/dashboard/jobs')}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Jobs
          </motion.button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-white hover:text-white/80 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Jobs</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <motion.div
              className="bg-white rounded-xl shadow-sm p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Building className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                    <p className="text-lg text-gray-600">{job.company}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={handleSaveJob}
                    className={`p-2 rounded-lg transition-colors ${
                      isSaved ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  </motion.button>
                  <motion.button
                    className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{job.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm">{job.type}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">{job.salary}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{job.posted}</span>
                </div>
              </div>

              {job.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Job Description */}
            <motion.div
              className="bg-white rounded-xl shadow-sm p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </motion.div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <motion.div
                className="bg-white rounded-xl shadow-sm p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <motion.div
                className="bg-white rounded-xl shadow-sm p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Responsibilities</h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-teal-600 rounded-full mt-2.5 flex-shrink-0"></div>
                      <span className="text-gray-700">{resp}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <motion.div
                className="bg-white rounded-xl shadow-sm p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits & Perks</h2>
                <ul className="space-y-3">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Star className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white rounded-xl shadow-sm p-6 sticky top-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Apply Button */}
              <motion.button
                onClick={handleApplyNow}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-lg font-semibold text-lg mb-6 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Apply Now
              </motion.button>

              {/* Job Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Applicants</span>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{job.applicants}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Experience</span>
                  <div className="flex items-center space-x-1">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{job.experience}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Education</span>
                  <div className="flex items-center space-x-1">
                    <GraduationCap className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-sm">{job.education}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Posted</span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{job.posted}</span>
                  </div>
                </div>
              </div>

              {/* Company Info */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">About {job.company}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Contact the company directly for more information about their culture, values, and work environment.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobDetails;
