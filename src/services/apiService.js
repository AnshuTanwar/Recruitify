/**
 * API Service for Recruitify Frontend
 * Handles all backend API calls with proper error handling
 */

const API_BASE_URL = 'https://recruitify-backend-f2zw.onrender.com';

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
    if (token && token !== 'demo-token-' + Date.now()) {
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
    return this.makeRequest('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
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
        timeout: 5000,
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Backend health check successful:', data);
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
    
    if (token && token !== 'demo-token-' + Date.now()) {
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
    return this.makeAuthenticatedRequest('/api/recruiter/job', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  // Get recruiter's jobs
  static async getRecruiterJobs() {
    return this.makeAuthenticatedRequest('/api/recruiter/job');
  }

  // Update job
  static async updateJob(jobId, jobData) {
    return this.makeAuthenticatedRequest(`/api/recruiter/job/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  }

  // Delete job
  static async deleteJob(jobId) {
    return this.makeAuthenticatedRequest(`/api/recruiter/job/${jobId}`, {
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
    
    return this.makeAuthenticatedRequest(`/api/recruiter/job/${jobId}/applications?${queryParams}`);
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
    const queryParams = new URLSearchParams({
      jobId: params.jobId || '',
      status: params.status || '',
      sort: params.sort || 'createdAt'
    }).toString();
    
    return this.makeAuthenticatedRequest(`/api/recruiter/job/applications?${queryParams}`);
  }
}

export default ApiService;
