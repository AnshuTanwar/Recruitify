import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  User, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Star,
  Eye,
  MessageSquare,
  Download,
  MoreVertical,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';
import RecruiterLayout from '../components/RecruiterLayout.jsx';

const RecruiterCandidates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [filterJob, setFilterJob] = useState('all');

  // Get real candidate applications from localStorage
  const candidates = [];
  
  // Get job titles from posted jobs for filtering
  const postedJobs = JSON.parse(localStorage.getItem('postedJobs') || '[]');
  const stages = ['Applied', 'Screening', 'Review', 'Offer', 'Hired', 'Rejected'];
  const jobs = postedJobs.map(job => job.title);

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === 'all' || candidate.stage.toLowerCase() === filterStage;
    const matchesJob = filterJob === 'all' || candidate.appliedJob === filterJob;
    return matchesSearch && matchesStage && matchesJob;
  });

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Applied':
        return 'bg-blue-100 text-blue-700';
      case 'Screening':
        return 'bg-yellow-100 text-yellow-700';
      case 'Review':
        return 'bg-purple-100 text-purple-700';
      case 'Offer':
        return 'bg-green-100 text-green-700';
      case 'Hired':
        return 'bg-emerald-100 text-emerald-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <RecruiterLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Candidates ({candidates.length})</h1>
            <p className="text-white/70">Manage your candidate pipeline</p>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search candidates..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Stages</option>
              {stages.map(stage => (
                <option key={stage} value={stage.toLowerCase()}>{stage}</option>
              ))}
            </select>
            <select
              value={filterJob}
              onChange={(e) => setFilterJob(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Jobs</option>
              {jobs.map(job => (
                <option key={job} value={job}>{job}</option>
              ))}
            </select>
            <motion.button
              className="bg-gradient-to-r from-teal-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Apply Filters
            </motion.button>
          </div>
        </motion.div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCandidates.map((candidate, index) => (
            <motion.div
              key={candidate.id}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                      <p className="text-gray-600">{candidate.title}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{candidate.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{candidate.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      <span>{candidate.experience} experience</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <GraduationCap className="w-4 h-4" />
                      <span>{candidate.education}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Applied for: <span className="font-medium">{candidate.appliedJob}</span></p>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStageColor(candidate.stage)}`}>
                        {candidate.stage}
                      </span>
                      <span className="text-xs text-gray-500">Applied {candidate.appliedDate}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          +{candidate.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Last activity: {candidate.lastActivity}</span>
                    <div className="flex items-center space-x-2">
                      <motion.button
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-300"
                        whileHover={{ scale: 1.1 }}
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-300"
                        whileHover={{ scale: 1.1 }}
                        title="Download Resume"
                      >
                        <Download className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        className="p-2 text-gray-400 hover:text-purple-600 transition-colors duration-300"
                        whileHover={{ scale: 1.1 }}
                        title="Send Message"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        className="p-2 text-gray-400 hover:text-teal-600 transition-colors duration-300"
                        whileHover={{ scale: 1.1 }}
                        title="Schedule Discussion"
                      >
                        <Calendar className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterCandidates;
