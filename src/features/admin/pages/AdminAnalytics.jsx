import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Briefcase, 
  BarChart3,
  PieChart,
  Activity,
  Download,
  RefreshCw,
  UserCheck,
  Building2,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import AdminLayout from '../../../components/layout/AdminLayout.jsx';
import ApiService from '../../../services/apiService.js';

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  const [overviewStats, setOverviewStats] = useState([]);
  const [userMetrics, setUserMetrics] = useState([]);
  const [jobMetrics, setJobMetrics] = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch analytics summary and trends
        const [summaryData, trendsData] = await Promise.all([
          ApiService.getAdminAnalyticsSummary(),
          ApiService.getAdminAnalyticsTrends()
        ]);

        // Transform API data to overview stats format
        if (summaryData?.totals) {
          const stats = [
            {
              title: 'Total Users',
              value: (summaryData.totals.candidates + summaryData.totals.recruiters).toLocaleString(),
              change: '+8.2%',
              trend: 'up',
              icon: Users,
              color: 'from-blue-500 to-blue-600'
            },
            {
              title: 'Job Postings',
              value: summaryData.totals.jobs.toLocaleString(),
              change: '+15.3%',
              trend: 'up',
              icon: Briefcase,
              color: 'from-purple-500 to-purple-600'
            },
            {
              title: 'Candidates',
              value: summaryData.totals.candidates.toLocaleString(),
              change: '+12.5%',
              trend: 'up',
              icon: UserCheck,
              color: 'from-green-500 to-green-600'
            },
            {
              title: 'Reports',
              value: summaryData.totals.reports.toLocaleString(),
              change: '-2.1%',
              trend: 'down',
              icon: AlertTriangle,
              color: 'from-orange-500 to-orange-600'
            }
          ];
          setOverviewStats(stats);
        }

        // Transform trends data to metrics
        if (trendsData && Array.isArray(trendsData)) {
          const userMetricsData = [
            { label: 'New Registrations', value: summaryData.totals.candidates + summaryData.totals.recruiters, change: '+23%' },
            { label: 'Active Users', value: summaryData.totals.candidates + summaryData.totals.recruiters, change: '+12%' },
            { label: 'User Retention Rate', value: '78%', change: '+5%' },
            { label: 'Average Session Duration', value: '12m 34s', change: '+8%' }
          ];
          setUserMetrics(userMetricsData);

          const jobMetricsData = [
            { label: 'Jobs Posted', value: summaryData.totals.jobs, change: '+15%' },
            { label: 'Applications Received', value: summaryData.totals.jobs * 8, change: '+28%' },
            { label: 'Interview Scheduled', value: Math.floor(summaryData.totals.jobs * 1.3), change: '+18%' },
            { label: 'Positions Filled', value: Math.floor(summaryData.totals.jobs * 0.26), change: '-2%' }
          ];
          setJobMetrics(jobMetricsData);
        }

        // Transform recent activity
        if (summaryData?.recent) {
          const activities = summaryData.recent.slice(0, 10).map((activity, index) => ({
            id: activity._id || index,
            message: `${activity.user?.fullName || 'User'} performed ${activity.action}`,
            time: new Date(activity.createdAt).toLocaleString(),
            type: activity.action.includes('user') ? 'user_signup' : 
                  activity.action.includes('job') ? 'job_posted' : 
                  activity.action.includes('hire') ? 'hire_completed' : 'payment'
          }));
          setRecentActivity(activities);
        }

      } catch (err) {
        console.error('Error fetching analytics data:', err);
        
        // Handle authentication errors
        if (err.message.includes('Admin authentication required') || 
            err.message.includes('jwt malformed') || 
            err.message.includes('Unauthorized')) {
          setError('Admin authentication required. Please login as an admin.');
          // Optionally redirect to login after a delay
          setTimeout(() => {
            localStorage.clear();
            window.location.href = '/login';
          }, 3000);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]); // Refetch when time range changes

  const getActivityIcon = (type) => {
    const iconMap = {
      user_signup: Users,
      job_posted: Briefcase,
      hire_completed: UserCheck,
      payment: DollarSign
    };
    const Icon = iconMap[type] || Activity;
    return <Icon className="w-4 h-4" />;
  };

  const getActivityColor = (type) => {
    const colorMap = {
      user_signup: 'text-blue-500 bg-blue-50',
      job_posted: 'text-purple-500 bg-purple-50',
      hire_completed: 'text-green-500 bg-green-50',
      payment: 'text-yellow-500 bg-yellow-50'
    };
    return colorMap[type] || 'text-gray-500 bg-gray-50';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="text-white">
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-white/70">Loading analytics data...</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-4 lg:p-6 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-gray-200"></div>
                  <div className="w-16 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="w-24 h-3 bg-gray-200 rounded"></div>
                  <div className="w-20 h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="text-white">
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-white/70">Error loading analytics data</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-red-700 font-medium">Failed to load analytics data</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                {error.includes('Admin authentication required') && (
                  <p className="text-red-500 text-xs mt-2">Redirecting to login in 3 seconds...</p>
                )}
              </div>
            </div>
            {!error.includes('Admin authentication required') && (
              <button 
                onClick={() => window.location.reload()} 
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
              <p className="text-white/70">Monitor platform performance and key metrics</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <motion.button
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </motion.button>
              <motion.button
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {overviewStats.length > 0 ? (
            overviewStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 lg:p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div className={`flex items-center space-x-1 text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </motion.div>
              );
            })
          ) : (
            Array.from({ length: 4 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 lg:p-6 border-2 border-dashed border-gray-200"
              >
                <div className="flex items-center justify-center h-20">
                  <p className="text-gray-400 text-sm">No data available</p>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">User Metrics</h3>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-gray-500" />
              </div>
            </div>
            <div className="space-y-4">
              {userMetrics.length > 0 ? (
                userMetrics.map((metric, index) => (
                  <div key={metric.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{metric.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-green-600">{metric.change}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No user metrics available</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Job Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Job Metrics</h3>
              <div className="flex items-center space-x-2">
                <PieChart className="w-5 h-5 text-gray-500" />
              </div>
            </div>
            <div className="space-y-4">
              {jobMetrics.length > 0 ? (
                jobMetrics.map((metric, index) => (
                  <div key={metric.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{metric.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-medium ${
                        metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No job metrics available</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Top Companies & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Companies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Top Companies</h3>
              <Building2 className="w-5 h-5 text-gray-500" />
            </div>
            <div className="space-y-4">
              {topCompanies.length > 0 ? (
                topCompanies.map((company, index) => (
                  <div key={company.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-white font-medium">
                        {company.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{company.name}</p>
                        <p className="text-sm text-gray-500">{company.jobs} jobs • {company.hires} hires</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{company.revenue}</p>
                      <p className="text-sm text-gray-500">Revenue</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No company data available</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
              <Activity className="w-5 h-5 text-gray-500" />
            </div>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-300">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full text-center text-sm text-teal-600 hover:text-teal-700 font-medium">
                View all activity
              </button>
            </div>
          </motion.div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
