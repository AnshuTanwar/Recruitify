import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Clock, CheckCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

function AppliedJobs() {
  const appliedJobs = [
    {
      title: 'Networking Engineer',
      type: 'Remote',
      company: 'Washington',
      salary: '$50k-60k/month',
      dateApplied: 'Feb 2, 2019 19:28',
      status: 'Active'
    },
    {
      title: 'Product Designer',
      type: 'Full Time',
      company: 'Dhaka',
      salary: '$50k-80k/month',
      dateApplied: 'Dec 7, 2019 23:26',
      status: 'Active'
    },
    {
      title: 'Junior Graphic Designer',
      type: 'Temporary',
      company: 'Brazil',
      salary: '$50k-60k/month',
      dateApplied: 'Feb 2, 2019 10:28',
      status: 'Active'
    },
    {
      title: 'Visual Designer',
      type: 'Contract Base',
      company: 'Wisconsin',
      salary: '$50k-80k/month',
      dateApplied: 'Dec 7, 2019 23:26',
      status: 'Active'
    },
    {
      title: 'Marketing Officer',
      type: 'Full Time',
      company: 'United States',
      salary: '$50k-80k/month',
      dateApplied: 'Dec 4, 2019 21:42',
      status: 'Active'
    },
    {
      title: 'UI/UX Designer',
      type: 'Full Time',
      company: 'North Dakota',
      salary: '$50k-80k/month',
      dateApplied: 'Dec 30, 2019 07:52',
      status: 'Active'
    },
    {
      title: 'Software Engineer',
      type: 'Full Time',
      company: 'New York',
      salary: '$50k-60k/month',
      dateApplied: 'Dec 20, 2019 05:19',
      status: 'Active'
    },
    {
      title: 'Front End Developer',
      type: 'Full Time',
      company: 'Michigan',
      salary: '$50k-80k/month',
      dateApplied: 'Mar 26, 2019 23:14',
      status: 'Active'
    }
  ];

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
            {appliedJobs.map((job, index) => (
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
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

export default AppliedJobs;
