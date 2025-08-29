import { motion } from 'framer-motion';
import { MapPin, DollarSign, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

function JobAlerts() {
  const jobAlerts = [
    {
      title: 'Technical Support Specialist',
      type: 'Full Time',
      location: 'SSDL, USA',
      salary: '$10k-$12k',
      timeRemaining: '4 Days Remaining'
    },
    {
      title: 'UI/UX Designer',
      type: 'Full Time',
      location: 'Minnesota, USA',
      salary: '$10k-$11k',
      timeRemaining: '2 Days Remaining'
    },
    {
      title: 'Front End Developer',
      type: 'Internship',
      location: 'Mymensingh, Bangladesh',
      salary: '$10k-$15k',
      timeRemaining: '4 Days Remaining'
    },
    {
      title: 'Marketing Officer',
      type: 'Full Time',
      location: 'Montana, USA',
      salary: '$20k-$25k',
      timeRemaining: '4 Days Remaining'
    },
    {
      title: 'Networking Engineer',
      type: 'Full Time',
      location: 'Michigan, USA',
      salary: '$5k-$10k',
      timeRemaining: '4 Days Remaining'
    },
    {
      title: 'Senior UX Designer',
      type: 'Full Time',
      location: 'United Kingdom of Great Britain',
      salary: '$200-$35k',
      timeRemaining: '4 Days Remaining',
      highlighted: true
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Job Alerts ({jobAlerts.length} new jobs)</h1>
          </div>
          <motion.button
            className="text-teal-400 hover:text-teal-300 font-medium flex items-center space-x-1"
            whileHover={{ x: 5 }}
          >
            <span>Edit Job Alerts</span>
          </motion.button>
        </motion.div>

        {/* Job Alerts List */}
        <div className="space-y-4">
          {jobAlerts.map((job, index) => (
            <motion.div
              key={index}
              className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 ${
                job.highlighted ? 'border-2 border-blue-200 bg-blue-50/30' : 'border border-gray-200'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          job.type === 'Full Time' ? 'bg-blue-100 text-blue-700' :
                          job.type === 'Internship' ? 'bg-green-100 text-green-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {job.type}
                        </span>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{job.timeRemaining}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <motion.div
          className="flex items-center justify-center space-x-2 pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.button
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </motion.button>
          
          {[1, 2, 3, 4, 5].map((page) => (
            <motion.button
              key={page}
              className={`w-10 h-10 rounded-lg font-medium transition-colors duration-300 ${
                page === 1 
                  ? 'bg-green-500 text-white' 
                  : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {page}
            </motion.button>
          ))}
          
          <motion.button
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </motion.button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

export default JobAlerts;
