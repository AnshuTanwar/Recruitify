import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Clock, CheckCircle, Loader2 } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import ApiService from '../../../services/apiService.js';

const AppliedJobs = () => {
  const navigate = useNavigate();
  
  // State for API data
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch applied jobs from backend
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const applications = await ApiService.getCandidateApplications();
        
        // Transform the data for display using exact backend structure
        const transformedJobs = applications.map(application => ({
          id: application._id,
          jobId: application.job._id,
          title: application.job?.jobName || 'Job Title Not Available',
          company: application.job?.companyName || 'Company Name Not Available',
          location: application.job?.location || 'Location not specified',
          type: application.job?.type?.replace('-', ' ') || 'full time',
          salary: application.job?.salary?.min && application.job?.salary?.max ? 
            `₹${application.job.salary.min.toLocaleString()}-${application.job.salary.max.toLocaleString()}/${application.job.salary.period || 'year'}` : 
            'Salary not specified',
          dateApplied: new Date(application.createdAt).toLocaleDateString(),
          status: application.status || 'applied',
          atsScore: application.atsScore,
          experienceLevel: application.job?.experienceLevel || 'Not specified',
          skillsRequired: application.job?.skillsRequired || []
        }));
        
        setAppliedJobs(transformedJobs);
      } catch (err) {
        console.error('Error fetching applied jobs:', err);
        setError(err.message || 'Failed to load applied jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500 mr-3" />
          <span className="text-white text-lg">Loading applications...</span>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
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
      </DashboardLayout>
    );
  }

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
          <h1 className="text-2xl font-bold text-white mb-2">Applied Jobs ({appliedJobs.length})</h1>
        </motion.div>

        {/* Jobs Table */}
        <motion.div
          className="bg-white rounded-xl shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
              <div className="col-span-4">JOBS</div>
              <div className="col-span-2">DATE APPLIED</div>
              <div className="col-span-2">STATUS</div>
              <div className="col-span-4">ACTION</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {appliedJobs.length > 0 ? appliedJobs.map((job, index) => (
              <motion.div
                key={index}
                className="px-6 py-4 hover:bg-gray-50 transition-colors duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <div className="grid grid-cols-12 gap-4 items-center">
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
                      onClick={() => navigate(`/dashboard/applied-jobs/${job.id}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="px-6 py-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Briefcase className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-500 mb-4">You haven't applied to any jobs yet. Start browsing and apply to jobs that match your skills.</p>
                <motion.button
                  onClick={() => navigate('/dashboard/jobs')}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Browse Jobs
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AppliedJobs;
