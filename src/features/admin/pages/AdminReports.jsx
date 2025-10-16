import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Eye, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Filter, 
  Search, 
  RefreshCw,
  Clock,
  User,
  MessageSquare,
  Flag
} from 'lucide-react';
import AdminLayout from '../../../components/layout/AdminLayout.jsx';
import ApiService from '../../../services/apiService.js';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch reports data
  useEffect(() => {
    fetchReports();
  }, [currentPage, statusFilter]);

  // Filter reports based on search and status
  useEffect(() => {
    let filtered = reports;
    
    if (searchTerm) {
      filtered = filtered.filter(report => 
        report.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportedBy?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportedUser?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredReports(filtered);
  }, [reports, searchTerm]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: 10,
        status: statusFilter === 'all' ? '' : statusFilter
      };

      const response = await ApiService.getAdminReports(params);
      
      if (response && response.reports) {
        setReports(response.reports);
        setTotalPages(Math.ceil(response.total / 10));
      }

    } catch (err) {
      console.error('Error fetching reports:', err);
      
      if (err.message.includes('Admin authentication required') || 
          err.message.includes('jwt malformed') || 
          err.message.includes('Unauthorized')) {
        setError('Admin authentication required. Please login as an admin.');
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

  const handleReportAction = async (reportId, action) => {
    try {
      await ApiService.takeReportAction(reportId, action);
      
      // Update the report status locally
      setReports(prev => prev.map(report => 
        report._id === reportId 
          ? { ...report, status: action === 'delete' ? 'resolved' : 'ignored' }
          : report
      ));

      // Show success message (you could add a toast notification here)
      console.log(`Report ${action} successfully`);
      
    } catch (err) {
      console.error(`Error ${action} report:`, err);
      setError(`Failed to ${action} report: ${err.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'ignored':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getReportTypeIcon = (type) => {
    switch (type) {
      case 'spam':
        return <Flag className="w-4 h-4" />;
      case 'inappropriate':
        return <AlertTriangle className="w-4 h-4" />;
      case 'harassment':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="text-white">
            <h1 className="text-2xl font-bold text-white mb-2">Reports Management</h1>
            <p className="text-white/70">Loading reports...</p>
          </div>
          <div className="bg-white rounded-xl p-6 animate-pulse">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
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
            <h1 className="text-2xl font-bold text-white mb-2">Reports Management</h1>
            <p className="text-white/70">Error loading reports</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-red-700 font-medium">Failed to load reports</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                {error.includes('Admin authentication required') && (
                  <p className="text-red-500 text-xs mt-2">Redirecting to login in 3 seconds...</p>
                )}
              </div>
            </div>
            {!error.includes('Admin authentication required') && (
              <button 
                onClick={fetchReports} 
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
          className="text-white"
        >
          <h1 className="text-2xl font-bold text-white mb-2">Reports Management</h1>
          <p className="text-white/70">Review and manage user reports</p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search reports..."
                  className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="ignored">Ignored</option>
              </select>
            </div>
            <motion.button
              onClick={fetchReports}
              className="flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Reports List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          {filteredReports.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredReports.map((report, index) => (
                <motion.div
                  key={report._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2">
                          {getReportTypeIcon(report.type)}
                          <span className="font-medium text-gray-900">
                            {report.reason || 'No reason provided'}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Reported By:</p>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium">
                              {report.reportedBy?.fullName || 'Unknown User'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Reported User:</p>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium">
                              {report.reportedUser?.fullName || 'Unknown User'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {report.description && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-1">Description:</p>
                          <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg">
                            {report.description}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>
                          Reported {new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    {report.status === 'pending' && (
                      <div className="flex items-center space-x-2 ml-4">
                        <motion.button
                          onClick={() => handleReportAction(report._id, 'ignore')}
                          className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Ignore Report"
                        >
                          <XCircle className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleReportAction(report._id, 'delete')}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Resolve Report"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No reports match your current filters.' 
                  : 'No reports have been submitted yet.'}
              </p>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center space-x-2"
          >
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-teal-600 text-white rounded-lg">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
