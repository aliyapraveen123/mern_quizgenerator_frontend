import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://mern-quizgenerator-backend-5.onrender.com');

if (!apiUrl) {
  throw new Error('VITE_API_URL must be set to the deployed backend URL in production.');
}

// Create configured Axios instance
const API = axios.create({
  baseURL: `${apiUrl.replace(/\/+$/, '')}/api`,
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

