import api from './api';

export const getDashboardStats = async () => {
  const res = await api.get('/admin/dashboard');
  return res.data;
};

export const getAllReviews = async () => {
  const res = await api.get('/admin/reviews');
  return res.data;
};

export const deleteReviewAdmin = async (id) => {
  const res = await api.delete(`/admin/reviews/${id}`);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await api.get('/admin/users');
  return res.data;
};

export const deleteUserAdmin = async (id) => {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data;
};
