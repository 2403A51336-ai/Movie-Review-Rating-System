import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, Flame, Award, Clock, Film, ArrowRight } from 'lucide-react';
import * as movieService from '../services/movieService';
import Hero from '../components/Hero';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';

const HomePage = () => {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [trendingRes, popularRes, topRatedRes, nowPlayingRes, genresRes] =
          await Promise.allSettled([
            movieService.getTrending(1),
            movieService.getPopular(1),
            movieService.getTopRated(1),
            movieService.getNowPlaying(1),
            movieService.getGenres(),
          ]);

        const trendingList = trendingRes.status === 'fulfilled' ? trendingRes.value.results || [] : [];
        const popularList = popularRes.status === 'fulfilled' ? popularRes.value.results || [] : [];
        const topRatedList = topRatedRes.status === 'fulfilled' ? topRatedRes.value.results || [] : [];
        const nowPlayingList = nowPlayingRes.status === 'fulfilled' ? nowPlayingRes.value.results || [] : [];
        const genreList = genresRes.status === 'fulfilled' ? genresRes.value.genres || [] : [];

        setTrendingMovies(trendingList);
        setPopularMovies(popularList);
        setTopRatedMovies(topRatedList);
        setNowPlayingMovies(nowPlayingList);
        setGenres(genreList);

        // Pick top trending or popular movie as hero spotlight
        if (trendingList.length > 0) {
          setFeaturedMovie(trendingList[0]);
        } else if (popularList.length > 0) {
          setFeaturedMovie(popularList[0]);
        }
      } catch (err) {
        console.error('Error fetching home page movie data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return <Loader fullScreen message="Loading cinematic universe..." />;
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <Hero movie={featuredMovie} />

      <div className="app-container home-content-sections">
        {/* Genre Quick Filter Bar */}
        {genres.length > 0 && (
          <div className="genre-pill-bar">
            <span className="genre-pill-label">Explore by Genre:</span>
            <div className="genre-pill-scroll">
              {genres.slice(0, 10).map((g) => (
                <Link
                  key={g.id}
                  to={`/movies?genre=${g.id}`}
                  className="genre-filter-pill"
                >
                  {g.name}
                </Link>
              ))}
              <Link to="/movies" className="genre-filter-pill genre-all-pill">
                All &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* Section 1: Trending Movies */}
        <section className="movie-row-section">
          <div className="section-header">
            <div className="section-title-wrap">
              <TrendingUp size={22} className="text-red-500" />
              <h2 className="section-heading">Trending Movies</h2>
            </div>
            <Link to="/movies?sort=popularity.desc" className="section-view-all">
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="movies-grid">
            {trendingMovies.slice(0, 8).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* Section 2: Popular Movies */}
        <section className="movie-row-section">
          <div className="section-header">
            <div className="section-title-wrap">
              <Flame size={22} className="text-amber-500" />
              <h2 className="section-heading">Popular Right Now</h2>
            </div>
            <Link to="/movies?sort=popularity.desc" className="section-view-all">
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="movies-grid">
            {popularMovies.slice(0, 8).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* Community Callout Banner */}
        <div className="community-banner-card">
          <div className="banner-content">
            <span className="banner-badge">
              <Sparkles size={14} /> Join CineReview Community
            </span>
            <h3 className="banner-title">Rate Movies. Share Honest Reviews.</h3>
            <p className="banner-text">
              Have you watched something incredible or disappointing? Join thousands of movie lovers
              discussing the latest blockbusters and indie gems.
            </p>
            <div className="banner-actions">
              <Link to="/register" className="btn btn-primary">
                Create Free Account
              </Link>
              <Link to="/movies" className="btn btn-secondary">
                Discover More
              </Link>
            </div>
          </div>
        </div>

        {/* Section 3: Top Rated Movies */}
        <section className="movie-row-section">
          <div className="section-header">
            <div className="section-title-wrap">
              <Award size={22} className="text-purple-400" />
              <h2 className="section-heading">Top Rated Masterpieces</h2>
            </div>
            <Link to="/movies?sort=vote_average.desc" className="section-view-all">
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="movies-grid">
            {topRatedMovies.slice(0, 8).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* Section 4: Recently Released / Now Playing */}
        <section className="movie-row-section pb-12">
          <div className="section-header">
            <div className="section-title-wrap">
              <Clock size={22} className="text-emerald-400" />
              <h2 className="section-heading">Recently Released</h2>
            </div>
            <Link to="/movies?sort=primary_release_date.desc" className="section-view-all">
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="movies-grid">
            {nowPlayingMovies.slice(0, 8).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
