import axios from 'axios';

/**
 * Axios instance configured for the QR Code Manager API
 * Base URL points to the Express backend server
 */
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Request interceptor for API calls
 * Adds authentication tokens or other headers if needed in future
 */
api.interceptors.request.use(
  (config) => {
    // Log outgoing requests in development
    if (import.meta.env.DEV) {
      console.log(`📤 API Request: ${config.method.toUpperCase()} ${config.url}`);
    }
    
    // Add any auth tokens here in future phases
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for API calls
 * Handles common response patterns and errors
 */
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`📥 API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      console.error('🚫 Server error:', error.response.status, error.response.data);
      
      switch (error.response.status) {
        case 401:
          // Handle unauthorized access
          console.warn('Unauthorized access - redirecting to login');
          // router.push('/login');
          break;
        case 404:
          console.warn('Resource not found');
          break;
        case 500:
          console.error('Internal server error');
          break;
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('🌐 Network error: No response received');
    } else {
      // Something else happened while setting up the request
      console.error('💥 Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;