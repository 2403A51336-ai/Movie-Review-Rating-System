import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, RefreshCw, Film } from 'lucide-react';
import * as movieService from '../services/movieService';
import { useDebounce } from '../hooks/useDebounce';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';

const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get('search') || '';
  const initialGenre = searchParams.get('genre') || 'all';
  const initialSort = searchParams.get('sort') || 'popularity.desc';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchQuery, 400);

  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedSort, setSelectedSort] = useState(initialSort);

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await movieService.getGenres();
        if (res.genres) {
          setGenres(res.genres);
        }
      } catch (err) {
        console.error('Failed to load genres:', err);
      }
    };
    fetchGenres();
  }, []);

  // Update query params when state changes
  useEffect(() => {
    const params = {};
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
    if (selectedGenre !== 'all') params.genre = selectedGenre;
    if (selectedSort !== 'popularity.desc') params.sort = selectedSort;
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, selectedGenre, selectedSort, setSearchParams]);

  // Fetch movies function
  const fetchMovieList = useCallback(
    async (currentPage = 1, append = false) => {
      try {
        if (currentPage === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        let data;
        if (debouncedSearch.trim()) {
          data = await movieService.searchMovies(debouncedSearch.trim(), currentPage);
        } else {
          data = await movieService.getMovies({
            genre: selectedGenre === 'all' ? undefined : selectedGenre,
            sortBy: selectedSort,
            page: currentPage,
          });
        }

        const newResults = data.results || [];
        setTotalPages(data.totalPages || 1);

        if (append) {
          setMovies((prev) => [...prev, ...newResults]);
        } else {
          setMovies(newResults);
        }
      } catch (err) {
        console.error('Error fetching movies list:', err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [debouncedSearch, selectedGenre, selectedSort]
  );

  // Trigger search/filter fetch on criteria change
  useEffect(() => {
    setPage(1);
    fetchMovieList(1, false);
  }, [fetchMovieList]);

  const handleLoadMore = () => {
    if (page < totalPages && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovieList(nextPage, true);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('all');
    setSelectedSort('popularity.desc');
  };

  return (
    <div className="movies-page app-container">
      {/* Header & Title */}
      <div className="movies-page-header">
        <h1 className="page-heading">
          Explore <span className="text-gradient">Movies</span>
        </h1>
        <p className="page-subheading">
          Browse extensive library of cinematic releases, search titles, filter by genre, and discover your next favorite watch.
        </p>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="filters-card">
        {/* Search Input */}
        <div className="filter-search-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by title, director or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="filter-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="search-clear-btn"
              title="Clear search"
            >
              &times;
            </button>
          )}
        </div>

        {/* Filters and Sort Row */}
        <div className="filter-controls-row">
          {/* Genre Filter */}
          <div className="filter-group">
            <Filter size={15} className="filter-icon" />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Genres</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="filter-group">
            <SlidersHorizontal size={15} className="filter-icon" />
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="filter-select"
            >
              <option value="popularity.desc">Most Popular</option>
              <option value="vote_average.desc">Highest Rated</option>
              <option value="primary_release_date.desc">Release Date (Newest)</option>
              <option value="primary_release_date.asc">Release Date (Oldest)</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          {(searchQuery || selectedGenre !== 'all' || selectedSort !== 'popularity.desc') && (
            <button
              onClick={handleClearFilters}
              className="btn btn-ghost btn-sm reset-filter-btn"
            >
              <RefreshCw size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <Loader message="Loading movies..." />
      ) : movies.length === 0 ? (
        <div className="empty-state-card">
          <Film size={48} className="empty-icon text-slate-600" />
          <h3 className="empty-title">No movies found matching your criteria</h3>
          <p className="empty-subtitle">
            Try adjusting your search terms or genre filter to discover more titles.
          </p>
          <button onClick={handleClearFilters} className="btn btn-primary mt-4">
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="movies-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* Load More Button */}
          {page < totalPages && (
            <div className="load-more-container">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="btn btn-secondary btn-load-more"
              >
                {loadingMore ? (
                  <>
                    <div className="loader-spinner-sm"></div>
                    <span>Loading more movies...</span>
                  </>
                ) : (
                  <span>Load More Movies</span>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MoviesPage;
