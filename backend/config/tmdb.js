const axios = require('axios');
const { GENRES, CURATED_MOVIES } = require('../utils/tmdbFallbackData');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const isConfigured = () => {
  return Boolean(process.env.TMDB_API_KEY && process.env.TMDB_API_KEY.trim() !== '');
};

const getClient = () => {
  return axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
      api_key: process.env.TMDB_API_KEY,
    },
    timeout: 8000,
  });
};

// Map raw TMDB movie item to clean standardized format
const formatMovie = (m) => {
  return {
    id: m.id,
    title: m.title || m.original_title || 'Untitled',
    overview: m.overview || '',
    posterPath: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80',
    backdropPath: m.backdrop_path ? `https://image.tmdb.org/t/p/original${m.backdrop_path}` : (m.poster_path ? `https://image.tmdb.org/t/p/original${m.poster_path}` : 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1200&q=80'),
    releaseDate: m.release_date || '',
    releaseYear: m.release_date ? m.release_date.substring(0, 4) : 'N/A',
    rating: m.vote_average ? Number(m.vote_average.toFixed(1)) : 0,
    voteCount: m.vote_count || 0,
    genreIds: m.genre_ids || [],
    genres: Array.isArray(m.genres) ? m.genres.map((g) => g.name) : [],
    runtime: m.runtime || 0,
    director: m.director || '',
    cast: m.cast || [],
  };
};

const formatCurated = (m) => {
  const genreNames = m.genre_ids
    .map((gid) => {
      const match = GENRES.find((g) => g.id === gid);
      return match ? match.name : null;
    })
    .filter(Boolean);

  return {
    id: m.id,
    title: m.title,
    overview: m.overview,
    posterPath: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '',
    backdropPath: m.backdrop_path ? `https://image.tmdb.org/t/p/original${m.backdrop_path}` : '',
    releaseDate: m.release_date,
    releaseYear: m.release_date ? m.release_date.substring(0, 4) : 'N/A',
    rating: m.vote_average,
    voteCount: m.vote_count,
    genreIds: m.genre_ids,
    genres: genreNames,
    runtime: m.runtime,
    director: m.director,
    cast: m.cast,
  };
};

// Fetch Trending
const getTrending = async (page = 1) => {
  if (isConfigured()) {
    try {
      const res = await getClient().get('/trending/movie/week', { params: { page } });
      return {
        results: res.data.results.map(formatMovie),
        page: res.data.page,
        totalPages: res.data.total_pages,
        totalResults: res.data.total_results,
        isLiveApi: true,
      };
    } catch (err) {
      console.warn('TMDB API Trending error, falling back to curated:', err.message);
    }
  }

  const results = CURATED_MOVIES.filter((m) => m.categories.includes('trending')).map(formatCurated);
  return {
    results,
    page: 1,
    totalPages: 1,
    totalResults: results.length,
    isLiveApi: false,
  };
};

// Fetch Popular
const getPopular = async (page = 1) => {
  if (isConfigured()) {
    try {
      const res = await getClient().get('/movie/popular', { params: { page } });
      return {
        results: res.data.results.map(formatMovie),
        page: res.data.page,
        totalPages: res.data.total_pages,
        totalResults: res.data.total_results,
        isLiveApi: true,
      };
    } catch (err) {
      console.warn('TMDB API Popular error, falling back to curated:', err.message);
    }
  }

  const results = CURATED_MOVIES.filter((m) => m.categories.includes('popular')).map(formatCurated);
  return {
    results,
    page: 1,
    totalPages: 1,
    totalResults: results.length,
    isLiveApi: false,
  };
};

// Fetch Top Rated
const getTopRated = async (page = 1) => {
  if (isConfigured()) {
    try {
      const res = await getClient().get('/movie/top_rated', { params: { page } });
      return {
        results: res.data.results.map(formatMovie),
        page: res.data.page,
        totalPages: res.data.total_pages,
        totalResults: res.data.total_results,
        isLiveApi: true,
      };
    } catch (err) {
      console.warn('TMDB API Top Rated error, falling back to curated:', err.message);
    }
  }

  const results = CURATED_MOVIES.filter((m) => m.categories.includes('top_rated')).map(formatCurated);
  return {
    results,
    page: 1,
    totalPages: 1,
    totalResults: results.length,
    isLiveApi: false,
  };
};

// Fetch Now Playing / Recently Released
const getNowPlaying = async (page = 1) => {
  if (isConfigured()) {
    try {
      const res = await getClient().get('/movie/now_playing', { params: { page } });
      return {
        results: res.data.results.map(formatMovie),
        page: res.data.page,
        totalPages: res.data.total_pages,
        totalResults: res.data.total_results,
        isLiveApi: true,
      };
    } catch (err) {
      console.warn('TMDB API Now Playing error, falling back to curated:', err.message);
    }
  }

  const results = CURATED_MOVIES.filter((m) => m.categories.includes('now_playing')).map(formatCurated);
  return {
    results: results.length > 0 ? results : CURATED_MOVIES.slice(0, 4).map(formatCurated),
    page: 1,
    totalPages: 1,
    totalResults: results.length,
    isLiveApi: false,
  };
};

// Fetch Movie Details with Credits (cast & director)
const getMovieDetails = async (id) => {
  const numericId = Number(id);

  if (isConfigured()) {
    try {
      const [movieRes, creditsRes] = await Promise.all([
        getClient().get(`/movie/${numericId}`),
        getClient().get(`/movie/${numericId}/credits`),
      ]);

      const movie = movieRes.data;
      const credits = creditsRes.data;

      const directorObj = credits.crew ? credits.crew.find((c) => c.job === 'Director') : null;
      const director = directorObj ? directorObj.name : 'Unknown';

      const cast = (credits.cast || []).slice(0, 10).map((c) => ({
        name: c.name,
        character: c.character,
        profile_path: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      }));

      return {
        ...formatMovie(movie),
        genres: (movie.genres || []).map((g) => g.name),
        director,
        cast,
        isLiveApi: true,
      };
    } catch (err) {
      console.warn(`TMDB API Movie Details (${id}) error, falling back to curated:`, err.message);
    }
  }

  const found = CURATED_MOVIES.find((m) => m.id === numericId);
  if (found) {
    const formatted = formatCurated(found);
    return {
      ...formatted,
      isLiveApi: false,
    };
  }

  return null;
};

// Search Movies
const searchMovies = async (query, page = 1) => {
  if (!query || query.trim() === '') {
    return getPopular(page);
  }

  if (isConfigured()) {
    try {
      const res = await getClient().get('/search/movie', {
        params: { query: query.trim(), page },
      });
      return {
        results: res.data.results.map(formatMovie),
        page: res.data.page,
        totalPages: res.data.total_pages,
        totalResults: res.data.total_results,
        isLiveApi: true,
      };
    } catch (err) {
      console.warn('TMDB API Search error, falling back to curated search:', err.message);
    }
  }

  const qLower = query.toLowerCase();
  const matched = CURATED_MOVIES.filter(
    (m) =>
      m.title.toLowerCase().includes(qLower) ||
      m.overview.toLowerCase().includes(qLower) ||
      (m.director && m.director.toLowerCase().includes(qLower))
  ).map(formatCurated);

  return {
    results: matched,
    page: 1,
    totalPages: 1,
    totalResults: matched.length,
    isLiveApi: false,
  };
};

// Discover / Filter Movies by genre and sorting
const discoverMovies = async ({ genreId, sortBy = 'popularity.desc', page = 1 }) => {
  if (isConfigured()) {
    try {
      const params = {
        page,
        sort_by: sortBy,
      };
      if (genreId && genreId !== 'all') {
        params.with_genres = genreId;
      }
      const res = await getClient().get('/discover/movie', { params });
      return {
        results: res.data.results.map(formatMovie),
        page: res.data.page,
        totalPages: res.data.total_pages,
        totalResults: res.data.total_results,
        isLiveApi: true,
      };
    } catch (err) {
      console.warn('TMDB API Discover error, falling back to curated:', err.message);
    }
  }

  let list = [...CURATED_MOVIES];

  if (genreId && genreId !== 'all') {
    const gid = Number(genreId);
    list = list.filter((m) => m.genre_ids.includes(gid));
  }

  if (sortBy === 'vote_average.desc') {
    list.sort((a, b) => b.vote_average - a.vote_average);
  } else if (sortBy === 'primary_release_date.desc') {
    list.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
  } else {
    // popularity default
    list.sort((a, b) => b.vote_count - a.vote_count);
  }

  const formatted = list.map(formatCurated);
  return {
    results: formatted,
    page: 1,
    totalPages: 1,
    totalResults: formatted.length,
    isLiveApi: false,
  };
};

const getGenresList = async () => {
  if (isConfigured()) {
    try {
      const res = await getClient().get('/genre/movie/list');
      return res.data.genres || GENRES;
    } catch (err) {
      console.warn('TMDB API Genres error, using fallback genres:', err.message);
    }
  }
  return GENRES;
};

module.exports = {
  isConfigured,
  getTrending,
  getPopular,
  getTopRated,
  getNowPlaying,
  getMovieDetails,
  searchMovies,
  discoverMovies,
  getGenresList,
};
