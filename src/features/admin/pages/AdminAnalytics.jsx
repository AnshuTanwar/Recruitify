import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Briefcase, 
  Calendar, 
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Filter,
  RefreshCw,
  Eye,
  UserCheck,
  Building2,
  Clock,
  Target,
  Award,
  Globe
} from 'lucide-react';
import AdminLayout from '../../../components/layout/AdminLayout.jsx';

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  const overviewStats = [
    {
      title: 'Total Revenue',
      value: '$124,580',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Active Users',
      value: '1,247',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Job Postings',
      value: '342',
      change: '+15.3%',
      trend: 'up',
      icon: Briefcase,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Successful Hires',
      value: '89',
      change: '-2.1%',
      trend: 'down',
      icon: UserCheck,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const userMetrics = [
    { label: 'New Registrations', value: 156, change: '+23%' },
    { label: 'Active Sessions', value: 1247, change: '+12%' },
    { label: 'User Retention Rate', value: '78%', change: '+5%' },
    { label: 'Average Session Duration', value: '12m 34s', change: '+8%' }
  ];

  const jobMetrics = [
    { label: 'Jobs Posted', value: 342, change: '+15%' },
    { label: 'Applications Received', value: 2847, change: '+28%' },
    { label: 'Interview Scheduled', value: 456, change: '+18%' },
    { label: 'Positions Filled', value: 89, change: '-2%' }
  ];

  const topCompanies = [
    { name: 'TechCorp Solutions', jobs: 24, hires: 12, revenue: '$12,450' },
    { name: 'StartupIO', jobs: 18, hires: 8, revenue: '$8,920' },
    { name: 'Design Studio', jobs: 15, hires: 6, revenue: '$7,200' },
    { name: 'BigCorp Inc', jobs: 12, hires: 9, revenue: '$9,800' },
    { name: 'Innovation Labs', jobs: 10, hires: 4, revenue: '$5,600' }
  ];

  // Get real activity from localStorage (placeholder for now)
  const recentActivity = [];

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
          {overviewStats.map((stat, index) => {
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
          })}
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
              {userMetrics.map((metric, index) => (
                <div key={metric.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-green-600">{metric.change}</span>
                  </div>
                </div>
              ))}
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
              {jobMetrics.map((metric, index) => (
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
              ))}
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
              {topCompanies.map((company, index) => (
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
              ))}
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
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-300">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full text-center text-sm text-teal-600 hover:text-teal-700 font-medium">
                View all activity
              </button>
            </div>
          </motion.div>
        </div>

        {/* Performance Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-6">Key Performance Indicators</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">94.2%</p>
              <p className="text-sm text-gray-600">Platform Uptime</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">4.8/5</p>
              <p className="text-sm text-gray-600">User Satisfaction</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">2.3s</p>
              <p className="text-sm text-gray-600">Avg Response Time</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">23</p>
              <p className="text-sm text-gray-600">Countries Served</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
