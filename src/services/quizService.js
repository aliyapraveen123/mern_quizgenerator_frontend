import API from './api';

export const generateQuiz = async (payload) => {
  const res = await API.post('/quiz/generate', payload);
  return res.data;
};

export const getQuizById = async (id) => {
  const res = await API.get(`/quiz/${id}`);
  return res.data;
};

export const submitQuizResult = async (payload) => {
  const res = await API.post('/quiz/result', payload);
  return res.data;
};

export const getQuizHistory = async () => {
  const res = await API.get('/quiz/history');
  return res.data;
};
