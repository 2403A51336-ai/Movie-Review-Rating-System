import api from './api';

export const getMovieReviews = async (movieId, sort = 'newest') => {
  const res = await api.get(`/reviews/${movieId}`, { params: { sort } });
  return res.data;
};

export const createReview = async (reviewData) => {
  const res = await api.post('/reviews', reviewData);
  return res.data;
};

export const updateReview = async (id, reviewData) => {
  const res = await api.put(`/reviews/${id}`, reviewData);
  return res.data;
};

export const deleteReview = async (id) => {
  const res = await api.delete(`/reviews/${id}`);
  return res.data;
};

export const toggleHelpful = async (id) => {
  const res = await api.post(`/reviews/${id}/helpful`);
  return res.data;
};
