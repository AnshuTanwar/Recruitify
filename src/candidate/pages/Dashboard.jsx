import { motion } from 'framer-motion';
import { Briefcase, Heart, Bell, ArrowRight, MapPin, DollarSign, Clock, CheckCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Card from '../../shared/components/Card';

function Dashboard() {
  const stats = [
    {
      title: 'Applied Jobs',
      value: '589',
      icon: Briefcase,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Favorite Jobs',
      value: '238',
      icon: Heart,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Job Alerts',
      value: '574',
      icon: Bell,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  const recentApplications = [
    {
      title: 'Networking Engineer',
      type: 'Remote',
      company: 'Washington',
      salary: '$50k-80k/month',
      dateApplied: 'Feb 2, 2019 19:28',
      status: 'Active',
      highlighted: false
    },
    {
      title: 'Product Designer',
      type: 'Full Time',
      company: 'Dhaka',
      salary: '$50k-80k/month',
      dateApplied: 'Dec 7, 2019 23:26',
      status: 'Active',
      highlighted: false
    },
    {
      title: 'Junior Graphic Designer',
      type: 'Temporary',
      company: 'Brazil',
      salary: '$50k-60k/month',
      dateApplied: 'Feb 2, 2019 19:28',
      status: 'Active',
      highlighted: false
    },
    {
      title: 'Visual Designer',
      type: 'Contract Base',
      company: 'Wisconsin',
      salary: '$50k-80k/month',
      dateApplied: 'Dec 7, 2019 23:26',
      status: 'Active',
      highlighted: true
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white"
        >
          <h1 className="text-2xl font-bold text-white mb-2">Hello, Esther Howard</h1>
          <p className="text-white/70">Here is your daily activities and job alerts</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Profile Completion Alert */}
        <motion.div
          className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-purple-600"></div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Your profile editing is not completed.</h3>
                <p className="text-white/90 text-sm">Complete your profile editing & build your custom Resume</p>
              </div>
            </div>
            <motion.button
              className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Edit Profile</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* Recently Applied Jobs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recently Applied</h2>
            <motion.button
              className="text-teal-600 hover:text-teal-700 font-medium flex items-center space-x-1"
              whileHover={{ x: 5 }}
            >
              <span>View all</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
                <div className="col-span-4">JOBS</div>
                <div className="col-span-2">Date Applied</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-4">Action</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {recentApplications.map((job, index) => (
                <motion.div
                  key={index}
                  className={`px-6 py-4 hover:bg-gray-50 transition-colors duration-300 ${
                    job.highlighted ? 'border-2 border-blue-200 bg-blue-50/50' : ''
                  }`}
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
                              <span>{job.company}</span>
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
                      >
                        View Details
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
