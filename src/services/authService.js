import API from './api';

export const register = async (payload) => {
  const res = await API.post('/auth/register', payload);
  return res.data;
};

export const login = async (payload) => {
  const res = await API.post('/auth/login', payload);
  return res.data;
};

export const resendVerification = async (payload) => {
  const res = await API.post('/auth/resend-verification', payload);
  return res.data;
};

export const verifyOtp = async (payload) => {
  const res = await API.post('/auth/verify-otp', payload);
  return res.data;
};

export const updateProfile = async (payload) => {
  const res = await API.put('/auth/profile', payload);
  return res.data;
};

export const changePassword = async (payload) => {
  const res = await API.put('/auth/change-password', payload);
  return res.data;
};
