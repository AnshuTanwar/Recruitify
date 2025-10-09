import React, { useState } from 'react';
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
  ArrowLeft,
  CheckCircle,
  FileText,
  Mail,
  Phone,
  User,
  Download,
  Eye,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout.jsx';

const AppliedJobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Get real applied job data from localStorage
  const getAppliedJobData = () => {
    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    const application = appliedJobs.find(app => app.id === parseInt(id));
    
    if (!application) {
      return null;
    }

    // Get original job data
    const postedJobs = JSON.parse(localStorage.getItem('postedJobs') || '[]');
    const originalJob = postedJobs.find(job => job.id === application.jobId);

    return {
      // Application info
      id: application.id,
      title: application.title,
      company: application.company,
      location: application.location,
      type: application.type,
      salary: application.salary,
      dateApplied: application.dateApplied,
      status: application.status,
      applicationId: `APP-${application.id}`,
      
      // Application details from form
      applicationData: {
        resume: application.applicantData.resume?.name || 'Resume.pdf',
        coverLetter: application.applicantData.coverLetter || '',
        expectedSalary: application.applicantData.expectedSalary || 'Not specified',
        noticePeriod: application.applicantData.noticePeriod || 'Not specified',
        portfolioUrl: application.applicantData.portfolioUrl || '',
        firstName: application.applicantData.firstName || '',
        lastName: application.applicantData.lastName || '',
        email: application.applicantData.email || '',
        phone: application.applicantData.phone || '',
        currentPosition: application.applicantData.currentPosition || '',
        experience: application.applicantData.experience || ''
      },

      // Job details from original job posting
      description: originalJob?.description || 'Job description not available',
      requirements: originalJob?.requirements || [],
      responsibilities: originalJob?.responsibilities || [],
      benefits: originalJob?.benefits || [],
      skills: originalJob?.requiredSkills || [],
      experience: originalJob?.experienceLevel || 'Not specified',
      education: originalJob?.educationLevel || 'Not specified',

      // Simple timeline based on application status
      timeline: [
        {
          date: application.dateApplied,
          status: "Application Submitted",
          description: "Your application has been successfully submitted",
          completed: true
        },
        {
          date: application.status === 'Active' ? 'In Progress' : 'Pending',
          status: "Under Review",
          description: "Your application is being reviewed",
          completed: application.status !== 'Active',
          current: application.status === 'Active'
        },
        {
          date: "Pending",
          status: "Final Decision",
          description: "Final hiring decision will be communicated",
          completed: false
        }
      ]
    };
  };

  const appliedJob = getAppliedJobData();

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'under review':
      case 'under technical review':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'technical review':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'accepted':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // If application not found, show error message
  if (!appliedJob) {
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
            <span>Back to Applied Jobs</span>
          </motion.button>

          {/* Application Not Found */}
          <motion.div
            className="bg-white rounded-xl shadow-sm p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Application Not Found</h3>
            <p className="text-gray-500 mb-4">The application you're looking for doesn't exist or has been removed.</p>
            <motion.button
              onClick={() => navigate('/dashboard/applied-jobs')}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Applied Jobs
            </motion.button>
          </motion.div>
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
          <span>Back to Applied Jobs</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Application Header */}
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
                    <h1 className="text-2xl font-bold text-gray-900">{appliedJob.title}</h1>
                    <p className="text-lg text-gray-600">{appliedJob.company}</p>
                    <p className="text-sm text-gray-500">Application ID: {appliedJob.applicationId}</p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-lg border font-medium ${getStatusColor(appliedJob.status)}`}>
                  {appliedJob.status}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{appliedJob.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm">{appliedJob.type}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">{appliedJob.salary}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{appliedJob.dateApplied}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {appliedJob.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Application Timeline */}
            <motion.div
              className="bg-white rounded-xl shadow-sm p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Timeline</h2>
              <div className="space-y-4">
                {appliedJob.timeline.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.completed ? 'bg-green-100' : item.current ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {item.completed ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : item.current ? (
                        <Clock className="w-4 h-4 text-blue-600" />
                      ) : (
                        <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-medium ${
                          item.completed ? 'text-green-700' : item.current ? 'text-blue-700' : 'text-gray-500'
                        }`}>
                          {item.status}
                        </h3>
                        <span className="text-sm text-gray-500">{item.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Your Application Details */}
            <motion.div
              className="bg-white rounded-xl shadow-sm p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Application Details</h2>
              
              <div className="space-y-6">
                {/* Resume */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Resume/CV</h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">{appliedJob.applicationData.resume}</p>
                        <p className="text-sm text-gray-500">Uploaded on {appliedJob.dateApplied.split(' ')[0]}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Eye className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Download className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Cover Letter */}
                {appliedJob.applicationData.coverLetter && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Cover Letter</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {appliedJob.applicationData.coverLetter}
                      </p>
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Expected Salary</h3>
                    <p className="text-gray-600">{appliedJob.applicationData.expectedSalary}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Notice Period</h3>
                    <p className="text-gray-600">{appliedJob.applicationData.noticePeriod}</p>
                  </div>
                  {appliedJob.applicationData.portfolioUrl && (
                    <div className="md:col-span-2">
                      <h3 className="font-medium text-gray-900 mb-2">Portfolio</h3>
                      <a 
                        href={appliedJob.applicationData.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        {appliedJob.applicationData.portfolioUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Job Description */}
            <motion.div
              className="bg-white rounded-xl shadow-sm p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{appliedJob.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {appliedJob.requirements.slice(0, 3).map((req, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Key Responsibilities</h3>
                  <ul className="space-y-2">
                    {appliedJob.responsibilities.slice(0, 3).map((resp, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white rounded-xl shadow-sm p-6 sticky top-6 space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Quick Actions */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <motion.button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Contact Recruiter</span>
                  </motion.button>
                  
                  <motion.button
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Application</span>
                  </motion.button>
                </div>
              </div>

              {/* Application Stats */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Application Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Application ID</span>
                    <span className="font-medium text-sm">{appliedJob.applicationId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Applied Date</span>
                    <span className="font-medium text-sm">{appliedJob.dateApplied.split(' ')[0]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Experience Required</span>
                    <span className="font-medium text-sm">{appliedJob.experience}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Job Type</span>
                    <span className="font-medium text-sm">{appliedJob.type}</span>
                  </div>
                </div>
              </div>

              {/* Status Alert */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Application Status</h4>
                    <p className="text-blue-700 text-sm mt-1">
                      Your application is currently under technical review. You'll be notified of any updates.
                    </p>
                  </div>
                </div>
              </div>

              {/* Company Info */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">About {appliedJob.company}</h3>
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

export default AppliedJobDetails;
