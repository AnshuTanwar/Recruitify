import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Briefcase, 
  Target, 
  TrendingUp, 
  TrendingDown,
  Eye,
  MessageCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import RecruiterLayout from '../components/RecruiterLayout.jsx';
import ApiService from '../../../services/apiService.js';

const RecruiterAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postedJobs, setPostedJobs] = useState([]);
  const [totalApplications, setTotalApplications] = useState(0);
  const [jobPerformanceData, setJobPerformanceData] = useState([]);

  // Fetch analytics data from backend
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch recruiter jobs and applications
        const [jobsResponse, applicationsResponse] = await Promise.all([
          ApiService.getRecruiterJobs(),
          ApiService.getRecruiterApplications()
        ]);

        setPostedJobs(jobsResponse);
        setTotalApplications(applicationsResponse.count || 0);

        // Calculate job performance metrics
        const performanceData = jobsResponse.map(job => {
          const jobApplications = applicationsResponse.applications?.filter(
            app => app.job._id === job._id
          ) || [];
          
          const hiredCount = jobApplications.filter(app => app.status === 'hired').length;
          const conversionRate = jobApplications.length > 0 
            ? Math.round((hiredCount / jobApplications.length) * 100) 
            : 0;

          return {
            title: job.jobName,
            applications: jobApplications.length,
            reviews: jobApplications.filter(app => app.status === 'shortlisted').length,
            offers: jobApplications.filter(app => app.status === 'interview').length,
            hires: hiredCount,
            conversionRate: `${conversionRate}%`
          };
        });

        setJobPerformanceData(performanceData);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError(err.message || 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // Calculate metrics from real data
  const activeJobs = postedJobs.filter(job => job.status === 'open').length;
  
  const metrics = [
    {
      title: 'Total Applications',
      value: totalApplications.toString(),
      change: '+0%',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      trend: 'up'
    },
    {
      title: 'Active Jobs',
      value: activeJobs.toString(),
      change: '+0%',
      icon: Briefcase,
      color: 'from-green-500 to-green-600',
      trend: 'up'
    },
    {
      title: 'Total Jobs Posted',
      value: postedJobs.length.toString(),
      change: '+0%',
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      trend: 'up'
    }
  ];

  // Loading state
  if (loading) {
    return (
      <RecruiterLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500 mr-3" />
          <span className="text-white text-lg">Loading analytics...</span>
        </div>
      </RecruiterLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <RecruiterLayout>
        <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-6 text-center">
          <div className="text-red-400 mb-2">⚠️ Error Loading Analytics</div>
          <p className="text-red-300 text-sm mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </RecruiterLayout>
    );
  }

  // Use real job performance data
  const jobPerformance = jobPerformanceData;

  // Remove static source effectiveness data for now
  const sourceEffectiveness = [];

  return (
    <RecruiterLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white"
        >
          <h1 className="text-2xl font-bold text-white mb-2">Analytics & Reports</h1>
          <p className="text-white/70">Track your hiring performance and metrics</p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${metric.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-sm font-medium ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">{metric.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Job Performance */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Job Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Job Title</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Applications</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Reviews</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Offers</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Hires</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {jobPerformance.map((job, index) => (
                  <motion.tr
                    key={job.title}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <td className="py-4 px-4 font-medium text-gray-900">{job.title}</td>
                    <td className="py-4 px-4 text-gray-700">{job.applications}</td>
                    <td className="py-4 px-4">{job.reviews}</td>
                    <td className="py-4 px-4 text-gray-700">{job.offers}</td>
                    <td className="py-4 px-4 text-gray-700">{job.hires}</td>
                    <td className="py-4 px-4">
                      <span className="text-green-600 font-medium">{job.conversionRate}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Source Effectiveness */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Source Effectiveness</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Source</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Applications</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Hires</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Cost</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Effectiveness</th>
                </tr>
              </thead>
              <tbody>
                {sourceEffectiveness.map((source, index) => (
                  <motion.tr
                    key={source.source}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <td className="py-4 px-4 font-medium text-gray-900">{source.source}</td>
                    <td className="py-4 px-4 text-gray-700">{source.applications}</td>
                    <td className="py-4 px-4 text-gray-700">{source.hires}</td>
                    <td className="py-4 px-4 text-gray-700">{source.cost}</td>
                    <td className="py-4 px-4">
                      <span className={`font-medium ${
                        parseFloat(source.effectiveness) > 2 ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {source.effectiveness}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterAnalytics;
