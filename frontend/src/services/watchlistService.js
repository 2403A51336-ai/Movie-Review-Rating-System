import api from './api';

export const getWatchlist = async () => {
  const res = await api.get('/watchlist');
  return res.data;
};

export const addToWatchlist = async (movieId, movieData) => {
  const res = await api.post(`/watchlist/${movieId}`, movieData);
  return res.data;
};

export const removeFromWatchlist = async (movieId) => {
  const res = await api.delete(`/watchlist/${movieId}`);
  return res.data;
};

export const checkInWatchlist = async (movieId) => {
  const res = await api.get(`/watchlist/check/${movieId}`);
  return res.data;
};
