import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, Github, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container app-container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <Link to="/" className="navbar-logo">
              <div className="logo-icon-wrapper">
                <Film size={20} className="logo-film-icon" />
              </div>
              <span className="logo-text">
                Cine<span className="logo-accent">Review</span>
              </span>
            </Link>
            <p className="footer-tagline">
              Your premier destination for authentic movie reviews, ratings, and cinematic discovery.
              Rate movies, build watchlists, and connect with fellow film lovers.
            </p>
            <div className="footer-social-links">
              <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="social-icon-btn">
                <Github size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="social-icon-btn">
                <Twitter size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="social-icon-btn">
                <Instagram size={18} />
              </a>
              <a href="mailto:contact@cinereview.com" aria-label="Email Us" className="social-icon-btn">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/movies">Browse Movies</Link></li>
              <li><Link to="/movies?sort=vote_average.desc">Top Rated</Link></li>
              <li><Link to="/watchlist">My Watchlist</Link></li>
            </ul>
          </div>

          {/* Genres */}
          <div className="footer-col">
            <h4 className="footer-heading">Popular Genres</h4>
            <ul className="footer-links-list">
              <li><Link to="/movies?genre=28">Action</Link></li>
              <li><Link to="/movies?genre=878">Sci-Fi</Link></li>
              <li><Link to="/movies?genre=18">Drama</Link></li>
              <li><Link to="/movies?genre=35">Comedy</Link></li>
            </ul>
          </div>

          {/* About & Info */}
          <div className="footer-col">
            <h4 className="footer-heading">About CineReview</h4>
            <p className="footer-info-text">
              Built as a modern full-stack web application powered by React, Node.js, Express, and MongoDB Atlas.
            </p>
            <div className="footer-tmdb-notice">
              <span>Movie metadata and posters provided by</span>
              <strong className="text-white"> TMDB</strong>.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} CineReview. All rights reserved. Made for movie lovers everywhere.
          </p>
          <div className="footer-legal-links">
            <a href="#privacy">Privacy Policy</a>
            <span>&bull;</span>
            <a href="#terms">Terms of Service</a>
            <span>&bull;</span>
            <a href="#contact">Contact Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
