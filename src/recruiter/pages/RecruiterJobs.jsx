import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit, Trash2, Users, Calendar, MapPin, DollarSign, Plus, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import RecruiterLayout from '../components/RecruiterLayout';

function RecruiterJobs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const jobs = [
    {
      id: 1,
      title: 'UI/UX Designer',
      company: 'Recruitify',
      location: 'San Francisco, CA',
      type: 'Full Time',
      salary: '$70k-90k',
      applications: 245,
      status: 'Active',
      daysRemaining: 7,
      postedDate: '2 days ago'
    },
    {
      id: 2,
      title: 'Senior UX Designer',
      company: 'Recruitify',
      location: 'New York, NY',
      type: 'Full Time',
      salary: '$90k-120k',
      applications: 186,
      status: 'Active',
      daysRemaining: 5,
      postedDate: '1 week ago'
    },
    {
      id: 3,
      title: 'Technical Support Specialist',
      company: 'Recruitify',
      location: 'Remote',
      type: 'Full Time',
      salary: '$50k-70k',
      applications: 324,
      status: 'Active',
      daysRemaining: 3,
      postedDate: '3 days ago'
    },
    {
      id: 4,
      title: 'Junior Graphic Designer',
      company: 'Recruitify',
      location: 'Los Angeles, CA',
      type: 'Part Time',
      salary: '$40k-55k',
      applications: 145,
      status: 'Active',
      daysRemaining: 12,
      postedDate: '5 days ago'
    },
    {
      id: 5,
      title: 'Front End Developer',
      company: 'Recruitify',
      location: 'Austin, TX',
      type: 'Contract',
      salary: '$80k-100k',
      applications: 298,
      status: 'Expired',
      daysRemaining: 0,
      postedDate: '2 weeks ago'
    }
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || job.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
            <h1 className="text-2xl font-bold text-white mb-2">My Jobs ({jobs.length})</h1>
            <p className="text-white/70">Manage your job postings and applications</p>
          </div>
          <Link to="/recruiter/post-job">
            <motion.button
              className="bg-gradient-to-r from-teal-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 shadow-lg shadow-teal-500/25"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-5 h-5" />
              <span>Post A Job</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search jobs by title or location..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Jobs List */}
        <motion.div
          className="bg-white rounded-xl shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
              <div className="col-span-4">JOB</div>
              <div className="col-span-2">DATE APPLIED</div>
              <div className="col-span-2">STATUS</div>
              <div className="col-span-4">ACTION</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
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
                        <span className="text-white font-semibold text-sm">
                          {job.title.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            job.type === 'Full Time' ? 'bg-blue-100 text-blue-700' :
                            job.type === 'Part Time' ? 'bg-yellow-100 text-yellow-700' :
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
                      <Calendar className="w-3 h-3" />
                      <span>{job.postedDate}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                      <Users className="w-3 h-3" />
                      <span>{job.applications} applications</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${
                        job.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        job.status === 'Active' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    {job.daysRemaining > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {job.daysRemaining} days remaining
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-4">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Applications
                      </motion.button>
                      <motion.button
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

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
            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
            <Link to="/recruiter/post-job">
              <motion.button
                className="bg-gradient-to-r from-teal-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Post Your First Job
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </RecruiterLayout>
  );
}

export default RecruiterJobs;
