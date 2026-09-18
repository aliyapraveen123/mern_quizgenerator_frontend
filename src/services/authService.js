import API from './api';

export const register = async (payload) => {
  const res = await API.post('/auth/register', payload);
  return res.data;
};

export const login = async (payload) => {
  const res = await API.post('/auth/login', payload);
  return res.data;
};
