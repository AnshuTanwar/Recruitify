import { motion } from 'framer-motion';
import { Briefcase, Users, Calendar, TrendingUp, Eye, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import RecruiterLayout from '../components/RecruiterLayout';

function RecruiterDashboard() {
  const stats = [
    {
      title: 'Open Jobs',
      value: '589',
      icon: Briefcase,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Recruiting',
      value: '2,517',
      icon: Users,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50'
    }
  ];

  const recentJobs = [
    {
      title: 'UI/UX Designer',
      type: 'Full Time',
      location: 'San Francisco',
      applications: 245,
      status: 'Active',
      daysRemaining: 7,
      statusColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Senior UX Designer',
      type: 'Full Time', 
      location: 'New York',
      applications: 186,
      status: 'Active',
      daysRemaining: 5,
      statusColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Technical Support Specialist',
      type: 'Full Time',
      location: 'Remote',
      applications: 324,
      status: 'Active',
      daysRemaining: 3,
      statusColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Junior Graphic Designer',
      type: 'Part Time',
      location: 'Los Angeles',
      applications: 145,
      status: 'Active',
      daysRemaining: 12,
      statusColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Front End Developer',
      type: 'Contract',
      location: 'Austin',
      applications: 298,
      status: 'Expired',
      daysRemaining: 0,
      statusColor: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <RecruiterLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white"
        >
          <h1 className="text-2xl font-bold text-white mb-2">Hello, Instagram</h1>
          <p className="text-white/70">Here is your daily activities and job applications</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
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
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recently Posted Jobs</h2>
            <motion.button
              className="text-teal-400 hover:text-teal-300 font-medium flex items-center space-x-1"
              whileHover={{ x: 5 }}
            >
              <span>View all</span>
            </motion.button>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
                <div className="col-span-4">JOBS</div>
                <div className="col-span-2">STATUS</div>
                <div className="col-span-2">APPLICATIONS</div>
                <div className="col-span-4">ACTIONS</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {recentJobs.map((job, index) => (
                <motion.div
                  key={index}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
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
                        >
                          View Applications
                        </motion.button>
                        <motion.button
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </RecruiterLayout>
  );
}

export default RecruiterDashboard;
