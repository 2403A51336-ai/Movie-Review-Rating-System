import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import * as watchlistService from '../services/watchlistService';

const WatchlistContext = createContext(null);

export const WatchlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWatchlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWatchlist([]);
      return;
    }
    try {
      setLoading(true);
      const data = await watchlistService.getWatchlist();
      if (data.success && Array.isArray(data.movies)) {
        setWatchlist(data.movies);
      }
    } catch (err) {
      console.warn('Could not fetch watchlist:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const isInWatchlist = useCallback(
    (tmdbId) => {
      if (!tmdbId) return false;
      const id = Number(tmdbId);
      return watchlist.some((m) => m.tmdbId === id);
    },
    [watchlist]
  );

  const addToWatchlist = async (movie) => {
    if (!isAuthenticated) {
      showToast('Please log in to add movies to your Watchlist', 'info');
      return false;
    }

    try {
      const data = await watchlistService.addToWatchlist(movie.id || movie.tmdbId, {
        title: movie.title,
        posterPath: movie.posterPath,
        backdropPath: movie.backdropPath,
        releaseDate: movie.releaseDate,
        genres: movie.genres,
        rating: movie.rating || movie.vote_average,
      });

      if (data.success && data.movies) {
        setWatchlist(data.movies);
        showToast(`"${movie.title}" added to your Watchlist!`, 'success');
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Failed to add to watchlist', 'error');
      return false;
    }
  };

  const removeFromWatchlist = async (tmdbId, title = 'Movie') => {
    if (!isAuthenticated) return false;

    try {
      const data = await watchlistService.removeFromWatchlist(Number(tmdbId));
      if (data.success && data.movies) {
        setWatchlist(data.movies);
        showToast(`"${title}" removed from your Watchlist.`, 'info');
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Failed to remove from watchlist', 'error');
      return false;
    }
  };

  const toggleWatchlist = async (movie) => {
    const id = movie.id || movie.tmdbId;
    if (isInWatchlist(id)) {
      return await removeFromWatchlist(id, movie.title);
    } else {
      return await addToWatchlist(movie);
    }
  };

  const value = {
    watchlist,
    watchlistCount: watchlist.length,
    loading,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    refreshWatchlist: fetchWatchlist,
  };

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
