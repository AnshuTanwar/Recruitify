import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  GraduationCap,
  Calendar,
  Globe,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  X,
  Loader2
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import ApiService from '../../../services/apiService.js';

const ApplyNow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedResume, setUploadedResume] = useState(null);
  const [existingResumes, setExistingResumes] = useState([]);
  const [selectedResumeKey, setSelectedResumeKey] = useState('');
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [candidateProfile, setCandidateProfile] = useState({});

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    
    // Professional Information
    currentPosition: '',
    experience: '',
    expectedSalary: '',
    noticePeriod: '',
    
    // Education
    education: '',
    university: '',
    graduationYear: '',
    
    // Application Details
    coverLetter: '',
    availability: '',
    referral: '',
    
    linkedinProfile: '',
    portfolioUrl: '',
    additionalInfo: ''
  });

  // Fetch job data and candidate profile from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get job data from candidate job feed since individual job endpoint doesn't exist
        const [profileResponse, jobsResponse] = await Promise.all([
          ApiService.getCandidateProfile(),
          ApiService.getCandidateJobFeed()
        ]);
        
        setCandidateProfile(profileResponse);
        
        // Resume endpoints are not implemented on backend yet
        setExistingResumes([]);
        
        // Find the specific job from the job feed
        const foundJob = jobsResponse.find(job => job._id === id);
        
        if (foundJob) {
          setJobData(foundJob);
        } else {
          // If job not found in feed, it might not match candidate's skills
          throw new Error('Job not found or not available for your skill set');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load job data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Prepare application data for backend
      const applicationData = {
        coverLetter: formData.coverLetter || ''
        // resumeKey is optional now since resume endpoints are not implemented
        // Backend has been updated to allow applications without resume
      };

      // Don't send resumeKey since we don't have real resume uploads yet

      // Submit application via API
      const response = await ApiService.applyToJob(jobData._id, applicationData);
      
      console.log('Application submitted successfully:', response);
    } catch (err) {
      console.error('Error submitting application:', err);
      setError(err.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
    
    // Navigate to applied jobs page
    navigate('/dashboard/applied-jobs');
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle file upload for resume
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a PDF, DOC, or DOCX file');
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setError('File size must be less than 5MB');
        return;
      }

      // Format file size for display
      const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };

      // Resume upload endpoints are not implemented yet, so we'll store locally
      setIsUploadingResume(true);
      setError(null);

      // Simulate upload delay for better UX
      setTimeout(() => {
        // Set uploaded resume with local file reference
        setUploadedResume({
          file: file,
          name: file.name,
          size: formatFileSize(file.size),
          key: `local_${file.name}_${Date.now()}` // Local reference key
        });

        // Clear selected resume from existing ones since we uploaded a new one
        setSelectedResumeKey('');
        setIsUploadingResume(false);
        
        // Show info message about local storage
        setError('Resume stored locally. Upload service will be available in future updates.');
      }, 1000);
    }
  };

  // Define application steps
  const steps = [
    { id: 1, title: 'Personal Info', icon: User, description: 'Basic information' },
    { id: 2, title: 'Resume Upload', icon: FileText, description: 'Upload your resume' },
    { id: 3, title: 'Cover Letter', icon: Mail, description: 'Write cover letter' },
    { id: 4, title: 'Review & Submit', icon: CheckCircle, description: 'Final review' }
  ];

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
  if (error || !jobData) {
    return (
      <DashboardLayout>
        <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-6 text-center">
          <div className="text-red-400 mb-2">⚠️ Error Loading Job</div>
          <p className="text-red-300 text-sm mb-4">{error || 'Job not found or not available for your skill set'}</p>
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-white hover:text-white/80 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Job Details</span>
          </motion.button>

          <motion.div
            className="text-white text-right"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-bold">Apply for Position</h1>
            <p className="text-white/70">{jobData.jobName} at Company</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Progress Sidebar */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4">Application Progress</h3>
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;
                  
                  return (
                    <div
                      key={step.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        isActive ? 'bg-teal-50 border border-teal-200' : 
                        isCompleted ? 'bg-green-50' : 'bg-gray-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-teal-600 text-white' :
                        isCompleted ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                      </div>
                      <span className={`font-medium ${
                        isActive ? 'text-teal-700' : 
                        isCompleted ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Main Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
                        placeholder="Enter your first name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
                        placeholder="Enter your last name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
                          placeholder="City, State/Country"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="url"
                          value={formData.linkedinProfile}
                          onChange={(e) => handleInputChange('linkedinProfile', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Professional Information */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Position</label>
                      <input
                        type="text"
                        value={formData.currentPosition}
                        onChange={(e) => handleInputChange('currentPosition', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
                        placeholder="e.g., Frontend Developer"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
                      <select
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
                      >
                        <option value="">Select experience level</option>
                        <option value="0-1">0-1 years</option>
                        <option value="1-3">1-3 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="5-7">5-7 years</option>
                        <option value="7+">7+ years</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expected Salary</label>
                      <input
                        type="text"
                        value={formData.expectedSalary}
                        onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
                        placeholder="e.g., $120,000 - $150,000"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notice Period</label>
                      <select
                        value={formData.noticePeriod}
                        onChange={(e) => handleInputChange('noticePeriod', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
                      >
                        <option value="">Select notice period</option>
                        <option value="immediate">Immediate</option>
                        <option value="2-weeks">2 weeks</option>
                        <option value="1-month">1 month</option>
                        <option value="2-months">2 months</option>
                        <option value="3-months">3 months</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio/Website URL</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="url"
                          value={formData.portfolioUrl}
                          onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
                          placeholder="https://yourportfolio.com"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Resume & Cover Letter */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Resume & Cover Letter</h2>
                  
                  {/* Error/Warning Display */}
                  {error && (
                    <div className={`border rounded-lg p-4 mb-6 ${
                      error.includes('locally') || error.includes('future updates')
                        ? 'bg-blue-50 border-blue-200' 
                        : error.includes('not available') 
                        ? 'bg-yellow-50 border-yellow-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <AlertCircle className={`w-5 h-5 mt-0.5 ${
                          error.includes('locally') || error.includes('future updates')
                            ? 'text-blue-600'
                            : error.includes('not available') 
                            ? 'text-yellow-600' 
                            : 'text-red-600'
                        }`} />
                        <div>
                          <h3 className={`font-medium ${
                            error.includes('locally') || error.includes('future updates')
                              ? 'text-blue-900'
                              : error.includes('not available') 
                              ? 'text-yellow-900' 
                              : 'text-red-900'
                          }`}>
                            {error.includes('locally') || error.includes('future updates') ? 'Info' :
                             error.includes('not available') ? 'Notice' : 'Upload Error'}
                          </h3>
                          <p className={`text-sm mt-1 ${
                            error.includes('locally') || error.includes('future updates')
                              ? 'text-blue-700'
                              : error.includes('not available') 
                              ? 'text-yellow-700' 
                              : 'text-red-700'
                          }`}>
                            {error}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Resume Selection/Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resume/CV *</label>
                    
                    {/* Existing Resumes */}
                    {existingResumes.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Select from your uploaded resumes:</h4>
                        <div className="space-y-2">
                          {existingResumes.map((resume) => (
                            <div
                              key={resume.key}
                              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                                selectedResumeKey === resume.key
                                  ? 'border-teal-500 bg-teal-50'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                              onClick={() => {
                                setSelectedResumeKey(resume.key);
                                setUploadedResume(null);
                              }}
                            >
                              <div className="flex items-center space-x-3">
                                <FileText className={`w-6 h-6 ${
                                  selectedResumeKey === resume.key ? 'text-teal-600' : 'text-gray-400'
                                }`} />
                                <div>
                                  <p className="font-medium text-gray-900">{resume.originalName}</p>
                                  <p className="text-sm text-gray-500">
                                    Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              {selectedResumeKey === resume.key && (
                                <CheckCircle className="w-5 h-5 text-teal-600" />
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="text-center my-4">
                          <span className="text-gray-500 text-sm">or</span>
                        </div>
                      </div>
                    )}

                    {/* Upload New Resume */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-400 transition-colors">
                      {uploadedResume ? (
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-8 h-8 text-teal-600" />
                            <div className="text-left">
                              <p className="font-medium text-gray-900">{uploadedResume.name}</p>
                              <p className="text-sm text-gray-500">{uploadedResume.size}</p>
                              <p className="text-sm text-green-600">✓ Uploaded successfully</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setUploadedResume(null)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          {isUploadingResume ? (
                            <div className="flex items-center justify-center space-x-2">
                              <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                              <span className="text-gray-600">Uploading resume...</span>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-600 mb-2">Upload a new resume</p>
                              <p className="text-sm text-gray-500">Supports PDF, DOC, DOCX (Max 5MB)</p>
                              <input
                                type="file"
                                onChange={handleFileUpload}
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                                id="resume-upload"
                                disabled={isUploadingResume}
                              />
                              <label
                                htmlFor="resume-upload"
                                className="mt-4 inline-block bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors disabled:opacity-50"
                              >
                                Choose File
                              </label>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Cover Letter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter</label>
                    <textarea
                      value={formData.coverLetter}
                      onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                      rows={8}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-gray-900 bg-white"
                      placeholder="Write a brief cover letter explaining why you're interested in this position and what makes you a great fit..."
                    />
                    <p className="text-sm text-gray-500 mt-2">Optional but recommended</p>
                  </div>
                  
                  {/* Additional Information */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
                    <textarea
                      value={formData.additionalInfo}
                      onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-gray-900 bg-white"
                      placeholder="Any additional information you'd like to share (certifications, achievements, etc.)"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Application</h2>
                  
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900">Name</h3>
                        <p className="text-gray-600">{formData.firstName} {formData.lastName}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Email</h3>
                        <p className="text-gray-600">{formData.email}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Phone</h3>
                        <p className="text-gray-600">{formData.phone}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Location</h3>
                        <p className="text-gray-600">{formData.location}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Experience</h3>
                        <p className="text-gray-600">{formData.experience}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Resume</h3>
                        <p className="text-gray-600">
                          {uploadedResume ? uploadedResume.name : 
                           selectedResumeKey ? existingResumes.find(r => r.key === selectedResumeKey)?.originalName || 'Selected resume' :
                           'Not selected'}
                        </p>
                      </div>
                    </div>
                    
                    {formData.coverLetter && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Cover Letter</h3>
                        <p className="text-gray-600 text-sm bg-white p-3 rounded border max-h-32 overflow-y-auto">
                          {formData.coverLetter}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-blue-900">Before you submit</h3>
                        <p className="text-blue-700 text-sm mt-1">
                          Please review all information carefully. Once submitted, you cannot edit your application.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t">
                <motion.button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    currentStep === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  whileHover={currentStep > 1 ? { scale: 1.02 } : {}}
                  whileTap={currentStep > 1 ? { scale: 0.98 } : {}}
                >
                  Previous
                </motion.button>

                {currentStep < 4 ? (
                  <motion.button
                    onClick={nextStep}
                    className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Next Step
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                      isSubmitting
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ApplyNow;
