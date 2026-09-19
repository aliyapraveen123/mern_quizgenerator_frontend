import API from './api';

export const forgotPassword = async (payload) => {
  const res = await API.post('/auth/forgot-password', payload);
  return res.data;
};

export const resetPassword = async (token, payload) => {
  const res = await API.post(`/auth/reset-password?token=${token}`, payload);
  return res.data;
};
