import axios from 'axios';

// Create a centralized Axios instance
const axiosClient = axios.create({
  // Rsbuild uses import.meta.env for environment variables (similar to Vite)
  baseURL: import.meta.env.PUBLIC_API_URL || 'https://api.nexgn.cloud/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10-second timeout for slow mobile networks
});

// ==========================================
// REQUEST INTERCEPTOR (Injects the JWT Token)
// ==========================================
axiosClient.interceptors.request.use(
  (config) => {
    // Grab the token from local storage (or a secure cookie if you transition to SSR)
    const token = localStorage.getItem('nexgn_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// RESPONSE INTERCEPTOR (Handles 401 Expired Sessions)
// ==========================================
axiosClient.interceptors.response.use(
  (response) => {
    // If the request succeeds, just return the data payload directly
    return response.data;
  },
  (error) => {
    const { response } = error;

    // If the server returns a 401 Unauthorized (Expired Token or Invalid Auth)
    if (response && response.status === 401) {
      // 1. Clear the dead token
      localStorage.removeItem('nexgn_token');
      localStorage.removeItem('nexgn_user');
      
      // 2. Only redirect if the user isn't already on the login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?session_expired=true';
      }
    }

    // Return the detailed error message from the backend so the UI can show a toast notification
    const errorMessage = response?.data?.message || 'An unexpected network error occurred.';
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosClient;