/**
 * API Service for Recruitify Frontend
 * Handles all backend API calls with proper error handling
 */

// Use local backend in development, deployed backend in production
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://recruitify-backend-f2zw.onrender.com'
  : 'http://localhost:5050';

class ApiService {
  // Helper method to make API calls
  static async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions = {
      headers: {},
      credentials: 'include', // Important for cookies (refresh tokens)
    };

    // Only add Content-Type for non-FormData requests
    // For FormData, the browser will set the correct Content-Type with boundary
    if (!(options.body instanceof FormData)) {
      defaultOptions.headers['Content-Type'] = 'application/json';
    }

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token && !token.startsWith('demo-token-') && token !== 'null' && token !== 'undefined') {
      defaultOptions.headers.Authorization = `Bearer ${token}`;
    }

    const finalOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, finalOptions);
      
      // Get response body based on content type
      let data = null;
      const contentType = response.headers.get('content-type') || '';
      
      try {
        if (contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }
      } catch (parseError) {
        // If we can't parse the response, create a generic error message
        console.warn('Failed to parse response:', parseError);
        data = `Failed to parse response: ${parseError.message}`;
      }

      if (!response.ok) {
        // Handle error responses
        let errorMessage;
        if (typeof data === 'object' && data?.message) {
          errorMessage = data.message;
        } else if (typeof data === 'string') {
          errorMessage = data;
        } else {
          errorMessage = `HTTP error! status: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Authentication APIs
  static async signup(userData) {
    return this.makeRequest('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  static async login(credentials) {
    return this.makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  static async logout() {
    try {
      console.log('Attempting logout...');
      const result = await this.makeRequest('/api/auth/logout', {
        method: 'POST',
      });
      console.log('Logout successful:', result);
      return result;
    } catch (error) {
      console.error('Logout API error:', error);
      throw error;
    }
  }

  static async refreshToken() {
    return this.makeRequest('/api/auth/refresh', {
      method: 'POST',
    });
  }

  static async forgotPassword(email) {
    console.log('Making forgot password request to:', `${API_BASE_URL}/api/auth/forgot-password`);
    
    // Add timeout for slow backend responses
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      const response = await this.makeRequest('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. The server might be sleeping. Please try again in a moment.');
      }
      throw error;
    }
  }

  static async resetPassword(userId, token, newPassword) {
    return this.makeRequest(`/api/auth/reset-password/${userId}/${token}`, {
      method: 'POST',
      body: JSON.stringify({ newPassword }),
    });
  }

  // Google OAuth - redirect to backend
  static getGoogleAuthUrl() {
    return `${API_BASE_URL}/api/auth/google`;
  }

  // Helper method to check if backend is available
  static async checkBackendHealth() {
    try {
      console.log('Checking backend health...');
      // Use test-redis endpoint as health check since /api/auth/health doesn't exist
      const response = await fetch(`${API_BASE_URL}/api/test-redis`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        console.log('✅ Backend health check successful');
        return true;
      } else {
        console.warn('Backend health check failed with status:', response.status);
        return false;
      }
    } catch (error) {
      console.warn('Backend health check failed:', error);
      return false;
    }
  }

  // Validate current token by making an authenticated request
  static async validateToken() {
    try {
      const token = localStorage.getItem('authToken');
      if (!token || token === 'null' || token === 'undefined') {
        throw new Error('No token found');
      }
      
      // Make an authenticated request to validate the token
      // Use a lightweight endpoint that requires authentication
      const response = await fetch(`${API_BASE_URL}/api/candidate/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        return true;
      } else if (response.status === 401 || response.status === 403) {
        // Token is expired or invalid, try to refresh
        console.log('Access token expired, attempting refresh...');
        return await this.attemptTokenRefresh();
      } else {
        throw new Error('Token validation failed');
      }
    } catch (error) {
      console.warn('Token validation failed:', error);
      // Try to refresh token as fallback
      return await this.attemptTokenRefresh();
    }
  }

  // Helper method to attempt token refresh
  static async attemptTokenRefresh() {
    try {
      console.log('Attempting to refresh token...');
      const refreshResult = await this.refreshToken();
      
      if (refreshResult && refreshResult.accessToken) {
        localStorage.setItem('authToken', refreshResult.accessToken);
        console.log('✅ Token refreshed successfully');
        return true;
      } else {
        throw new Error('No access token in refresh response');
      }
    } catch (refreshError) {
      console.warn('❌ Token refresh failed:', refreshError);
      return false;
    }
  }

  // Helper method to handle token refresh automatically
  static async makeAuthenticatedRequest(endpoint, options = {}) {
    try {
      return await this.makeRequest(endpoint, options);
    } catch (error) {
      // If token expired, try to refresh
      if (error.message.includes('401') || error.message.includes('403')) {
        try {
          const refreshResult = await this.refreshToken();
          localStorage.setItem('authToken', refreshResult.accessToken);
          
          // Retry the original request
          return await this.makeRequest(endpoint, options);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.clear();
          window.location.href = '/login';
          throw refreshError;
        }
      }
      throw error;
    }
  }

  // ==================== CANDIDATE APIs ====================
  
  // Get candidate profile
  static async getCandidateProfile() {
    return this.makeAuthenticatedRequest('/api/candidate/profile');
  }

  // Update candidate profile
  static async updateCandidateProfile(profileData) {
    return this.makeAuthenticatedRequest('/api/candidate/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Get job feed for candidate (skill-based matching)
  static async getCandidateJobFeed() {
    return this.makeAuthenticatedRequest('/api/candidate/feed');
  }

  // Apply to a job
  static async applyToJob(jobId, applicationData) {
    return this.makeAuthenticatedRequest(`/api/candidate/jobs/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  // Get candidate's applications
  static async getCandidateApplications() {
    return this.makeAuthenticatedRequest('/api/candidate/applications');
  }
  
  // // Get candidate's uploaded resumes
  static async getCandidateResumes() {
    return this.makeAuthenticatedRequest('/api/candidate/resumes');
  }

  // Upload resume
  static async uploadResume(formData) {
    // For FormData uploads, we need to remove Content-Type but keep Authorization
    const token = localStorage.getItem('authToken');
    const headers = {};
    
    if (token && !token.startsWith('demo-token-') && token !== 'null' && token !== 'undefined') {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return this.makeRequest('/api/candidate/resumes', {
      method: 'POST',
      headers, // Only Authorization header, no Content-Type for FormData
      body: formData,
      credentials: 'include',
    });
  }

  // Delete resume
  static async deleteResume(resumeKey) {
    const encodedKey = encodeURIComponent(resumeKey);
    return this.makeAuthenticatedRequest(`/api/candidate/resumes/${encodedKey}`, {
      method: "DELETE",
    });
  }


  // Get resume URL for viewing/downloading
  static async getResumeUrl(resumeKey) {
    const encodedKey = encodeURIComponent(resumeKey);
    return this.makeAuthenticatedRequest(`/api/candidate/resumes/${encodedKey}/url`, {
      method: "GET",
    });
  }

  // Get job details for a single job
  static async getJobDetails(jobId) {
    return this.makeAuthenticatedRequest(`/api/candidate/jobs/${jobId}`, {
      method: "GET",
    });
  }



  // ==================== RECRUITER APIs ====================
  
  // Get recruiter profile
  static async getRecruiterProfile() {
    return this.makeAuthenticatedRequest('/api/recruiter/profile');
  }

  // Update recruiter profile
  static async updateRecruiterProfile(profileData) {
    return this.makeAuthenticatedRequest('/api/recruiter/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Create new job
  static async createJob(jobData) {
    return this.makeAuthenticatedRequest('/api/recruiter/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  // Get recruiter's jobs
  static async getRecruiterJobs() {
    return this.makeAuthenticatedRequest('/api/recruiter/jobs');
  }

  // Update job
  static async updateJob(jobId, jobData) {
    return this.makeAuthenticatedRequest(`/api/recruiter/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  }

  // Delete job
  static async deleteJob(jobId) {
    return this.makeAuthenticatedRequest(`/api/recruiter/jobs/${jobId}`, {
      method: 'DELETE',
    });
  }

  // Get job applications with pagination and sorting
  static async getJobApplications(jobId, params = {}) {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 20,
      sort: params.sort || 'createdAt',
      status: params.status || '',
    }).toString();
    
    return this.makeAuthenticatedRequest(`/api/recruiter/jobs/${jobId}/applications?${queryParams}`);
  }

  // Update application status
  static async updateApplicationStatus(applicationId, statusData) {
    return this.makeAuthenticatedRequest(`/api/recruiter/applications/${applicationId}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  }

  // Get applicant resume URL
  static async getApplicantResumeUrl(applicationId) {
    return this.makeAuthenticatedRequest(`/api/recruiter/applications/${applicationId}/resume-url`);
  }

  // Get all applications for recruiter
  static async getRecruiterApplications(params = {}) {
    // If jobId is provided, get applications for specific job
    if (params.jobId) {
      const queryParams = new URLSearchParams({
        status: params.status || '',
        sort: params.sort || 'createdAt',
        atsScore: params.atsScore || ''
      }).toString();
      
      return this.makeAuthenticatedRequest(`/api/recruiter/jobs/${params.jobId}/applications?${queryParams}`);
    }
    
    // Build query parameters for all applications
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.sort) queryParams.append('sort', params.sort || 'ats');
    if (params.atsScore) queryParams.append('atsScore', params.atsScore);
    if (params.jobId) queryParams.append('jobId', params.jobId);
    
    const queryString = queryParams.toString();
    const url = `/api/recruiter/jobs/applications${queryString ? `?${queryString}` : ''}`;
    
    return this.makeAuthenticatedRequest(url);
  }

  // ==================== ADMIN APIs ====================
  
  // Note: Removed insecure client-side admin validation
  // Backend properly validates admin role via JWT + middleware
  
  // Get admin analytics summary (dashboard stats)
  static async getAdminAnalyticsSummary() {
    return this.makeAuthenticatedRequest('/api/admin/analytics/summary');
  }

  // Get admin analytics trends (last 7 days activity)
  static async getAdminAnalyticsTrends() {
    return this.makeAuthenticatedRequest('/api/admin/analytics/trends');
  }

  // Get admin overview data
  static async getAdminOverview() {
    return this.makeAuthenticatedRequest('/api/admin/overview');
  }

  // Get recent admin actions
  static async getAdminRecentActions() {
    return this.makeAuthenticatedRequest('/api/admin/recent-actions');
  }


  // Get all admin reports with optional pagination and filtering
  static async getAdminReports(params = {}) {
    if (Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams({
        status: params.status || '',
        page: params.page || 1,
        limit: params.limit || 20
      }).toString();
      return this.makeAuthenticatedRequest(`/api/admin/reports?${queryParams}`);
    }
    
    return this.makeAuthenticatedRequest('/api/admin/reports');
  }

  // Take action on a report
  static async takeReportAction(reportId, action) {
    return this.makeAuthenticatedRequest(`/api/admin/reports/${reportId}/action`, {
      method: 'PUT',
      body: JSON.stringify({ action })
    });
  }

  // Get report summary statistics
  static async getAdminReportSummary() {
    return this.makeAuthenticatedRequest('/api/admin/reports/summary');
  }

  // Get all jobs for admin - Note: Backend doesn't have admin job endpoints
  // Admin users cannot access recruiter or candidate job endpoints due to role restrictions
  static async getAdminJobs() {
    // Since backend doesn't have admin job endpoints and existing endpoints are role-protected,
    // we'll return an empty array and show appropriate message in UI
    console.warn('⚠️ No admin job endpoints available in backend. Admin users cannot access job data.');
    return [];
  }

  // Get job applications count for a specific job
  static async getJobApplicationsCount(jobId) {
    try {
      const response = await this.makeAuthenticatedRequest(`/api/recruiter/jobs/${jobId}/applications`);
      return response.count || 0;
    } catch (error) {
      console.warn('Could not fetch applications count:', error);
      return 0;
    }
  }

  // ==================== CHAT APIs ====================
  
  // Initiate chat room (Recruiter only)
  static async initiateChatRoom(jobId, candidateId) {
    return this.makeAuthenticatedRequest('/api/chat/initiate', {
      method: 'POST',
      body: JSON.stringify({ jobId, candidateId }),
    });
  }

  // Send message to chat room
  static async sendChatMessage(roomId, text) {
    return this.makeAuthenticatedRequest(`/api/chat/${roomId}/message`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  // Get all chat rooms for recruiter
  static async getChatRooms() {
    return this.makeAuthenticatedRequest('/api/chat/rooms');
  }

  // Get all chat rooms for candidate
  static async getCandidateChatRooms() {
    return this.makeAuthenticatedRequest('/api/chat/candidate-rooms');
  }

  // Get chat messages with pagination
  static async getChatMessages(roomId, page = 1, limit = 20) {
    return this.makeAuthenticatedRequest(`/api/chat/${roomId}/messages?page=${page}&limit=${limit}`);
  }

  // Mark messages as seen
  static async markMessagesAsSeen(roomId) {
    return this.makeAuthenticatedRequest(`/api/chat/${roomId}/seen`, {
      method: 'PUT',
    });
  }

  // Close/delete chat room
  static async closeChatRoom(roomId) {
    return this.makeAuthenticatedRequest(`/api/chat/${roomId}`, {
      method: 'DELETE',
    });
  }

  // Get AI question suggestions for recruiters
  static async getQuestionSuggestions(applicationId) {
    return this.makeAuthenticatedRequest(`/api/chat/${applicationId}/questions`);
  }

  // Get smart reply suggestions for candidates
  static async getSmartReplies(messageId) {
    return this.makeAuthenticatedRequest(`/api/chat/${messageId}/smart-reply`, {
      method: 'POST',
    });
  }

  // ==================== RESUME ANALYZER APIs ====================
  
  // Analyze resume against job description
  static async analyzeResume(analysisData) {
    // analysisData: { jobTitle, jobDescription, resumeKey?, newFile? }
    const formData = new FormData();
    
    formData.append('jobTitle', analysisData.jobTitle);
    formData.append('jobDescription', analysisData.jobDescription);
    
    if (analysisData.resumeKey) {
      formData.append('resumeKey', analysisData.resumeKey);
    }
    
    if (analysisData.newFile) {
      formData.append('newFile', analysisData.newFile);
    }

    // For FormData uploads, we need to remove Content-Type but keep Authorization
    const token = localStorage.getItem('authToken');
    const headers = {};
    
    if (token && !token.startsWith('demo-token-') && token !== 'null' && token !== 'undefined') {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return this.makeRequest('/api/candidate/resume/analyze', {
      method: 'POST',
      headers, // Only Authorization header, no Content-Type for FormData
      body: formData,
      credentials: 'include',
    });
  }
}

export default ApiService;
