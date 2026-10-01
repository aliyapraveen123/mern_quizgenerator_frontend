import axios from 'axios';

// Create configured Axios instance
const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`,
  withCredentials: true
});
// Remove token-from-localStorage interceptor: server now uses HttpOnly cookie

// Response interceptor: handle unauthorized globally and provide friendly errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;

    // If unauthorized, clear local auth and redirect to login
    if (status === 401) {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch (e) {
        // ignore
      }
      // Graceful redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject({ message: data?.message || 'Not authorized' });
    }

    // Normalize error message
    const message = data?.message || error.message || 'An error occurred';
    return Promise.reject({ message, code: data?.code });
  }
);

export default API;

