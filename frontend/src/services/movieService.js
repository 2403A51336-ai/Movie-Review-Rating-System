import api from './api';

export const getTrending = async (page = 1) => {
  const res = await api.get('/movies/trending', { params: { page } });
  return res.data;
};

export const getPopular = async (page = 1) => {
  const res = await api.get('/movies/popular', { params: { page } });
  return res.data;
};

export const getTopRated = async (page = 1) => {
  const res = await api.get('/movies/top-rated', { params: { page } });
  return res.data;
};

export const getNowPlaying = async (page = 1) => {
  const res = await api.get('/movies/now-playing', { params: { page } });
  return res.data;
};

export const getMovies = async ({ genre, sortBy, page = 1 } = {}) => {
  const res = await api.get('/movies', { params: { genre, sortBy, page } });
  return res.data;
};

export const searchMovies = async (query, page = 1) => {
  const res = await api.get('/movies/search', { params: { query, page } });
  return res.data;
};

export const getMovieDetails = async (id) => {
  const res = await api.get(`/movies/${id}`);
  return res.data;
};

export const getGenres = async () => {
  const res = await api.get('/movies/genres');
  return res.data;
};
