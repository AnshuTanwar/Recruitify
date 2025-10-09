import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Send, 
  Users, 
  Target, 
  CheckCircle, 
  AlertCircle,
  User,
  Mail,
  MapPin,
  Briefcase,
  Star
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import RecruiterLayout from '../components/RecruiterLayout.jsx';
import SkillMatchingService from '../../../services/skillMatchingService.js';

const TargetedJobSending = () => {
  const { jobId } = useParams();
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minMatchPercentage, setMinMatchPercentage] = useState(60);
  const [isSending, setIsSending] = useState(false);

  // Get real job data from localStorage
  const getJobData = () => {
    const savedJobs = localStorage.getItem('postedJobs');
    if (savedJobs) {
      const jobs = JSON.parse(savedJobs);
      return jobs.length > 0 ? jobs[0] : null; // Get first job for demo, or implement job selection
    }
    return null;
  };

  const jobData = getJobData();

  // Get real candidate data from localStorage or API
  const allCandidates = [];

  // Get matching candidates
  const matchingCandidates = SkillMatchingService.getMatchingCandidates(
    allCandidates,
    jobData.requiredSkills,
    minMatchPercentage
  );

  const filteredCandidates = matchingCandidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCandidateSelect = (candidateId) => {
    setSelectedCandidates(prev => {
      if (prev.includes(candidateId)) {
        return prev.filter(id => id !== candidateId);
      } else {
        return [...prev, candidateId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(filteredCandidates.map(c => c.id));
    }
  };

  const handleSendJob = async () => {
    setIsSending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSending(false);
    // Job sent successfully to selected candidates
    setSelectedCandidates([]);
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  const getMatchIcon = (percentage) => {
    if (percentage >= 80) return <CheckCircle className="w-4 h-4" />;
    if (percentage >= 60) return <Target className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  return (
    <RecruiterLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center space-x-4"
        >
          <Link to="/recruiter/jobs">
            <motion.button
              className="p-2 rounded-lg bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Send Job to Candidates</h1>
            <p className="text-white/70">Target candidates based on skill matching</p>
          </div>
        </motion.div>

        {/* Job Summary */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{jobData.title}</h3>
              <p className="text-gray-600">{jobData.company}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{jobData.location}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Briefcase className="w-4 h-4" />
                  <span>{jobData.type}</span>
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {jobData.requiredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search candidates..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Match: {minMatchPercentage}%
                </label>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={minMatchPercentage}
                  onChange={(e) => setMinMatchPercentage(parseInt(e.target.value))}
                  className="w-24"
                />
              </div>
              <motion.button
                onClick={handleSelectAll}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {selectedCandidates.length === filteredCandidates.length ? 'Deselect All' : 'Select All'}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Candidates List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              Matching Candidates ({filteredCandidates.length})
            </h2>
            {selectedCandidates.length > 0 && (
              <motion.button
                onClick={handleSendJob}
                disabled={isSending}
                className="bg-gradient-to-r from-teal-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSending ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send to {selectedCandidates.length} Candidate{selectedCandidates.length !== 1 ? 's' : ''}</span>
                  </>
                )}
              </motion.button>
            )}
          </div>

          <div className="space-y-4">
            {filteredCandidates.map((candidate, index) => (
              <motion.div
                key={candidate.id}
                className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all duration-300 cursor-pointer ${
                  selectedCandidates.includes(candidate.id)
                    ? 'border-teal-200 bg-teal-50/30'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => handleCandidateSelect(candidate.id)}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getMatchColor(candidate.skillMatch.matchPercentage)}`}>
                            {getMatchIcon(candidate.skillMatch.matchPercentage)}
                            <span>{candidate.skillMatch.matchPercentage}% Match</span>
                          </div>
                        </div>
                        <p className="text-gray-600 font-medium">{candidate.title}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{candidate.email}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{candidate.location}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Briefcase className="w-4 h-4" />
                            <span>{candidate.experience}</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedCandidates.includes(candidate.id)}
                          onChange={() => handleCandidateSelect(candidate.id)}
                          className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                        />
                      </div>
                    </div>

                    {/* Skill Match Details */}
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-700">Matched Skills:</span>
                        {candidate.skillMatch.matchedSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                      {candidate.skillMatch.missingSkills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm font-medium text-gray-700">Missing Skills:</span>
                          {candidate.skillMatch.missingSkills.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {candidate.skillMatch.missingSkills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              +{candidate.skillMatch.missingSkills.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Empty State */}
        {filteredCandidates.length === 0 && (
          <motion.div
            className="bg-white rounded-xl p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No matching candidates found</h3>
            <p className="text-gray-500">
              Try lowering the match threshold or adjusting the required skills for this job
            </p>
          </motion.div>
        )}
      </div>
    </RecruiterLayout>
  );
};

export default TargetedJobSending;
