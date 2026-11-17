import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Film,
  Search,
  Bookmark,
  User,
  Shield,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { watchlistCount } = useWatchlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuRef = useRef(null);

  // Handle navbar background blur on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={`navbar-header ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container app-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon-wrapper">
            <Film size={22} className="logo-film-icon" />
          </div>
          <span className="logo-text">
            Cine<span className="logo-accent">Review</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-nav desktop-nav">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            Home
          </NavLink>
          <NavLink to="/movies" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Movies
          </NavLink>
          <NavLink to="/movies?sort=vote_average.desc" className="nav-link">
            Top Rated
          </NavLink>
          <NavLink
            to="/watchlist"
            className={({ isActive }) => `nav-link nav-watchlist-link ${isActive ? 'active' : ''}`}
          >
            <span>My Watchlist</span>
            {isAuthenticated && watchlistCount > 0 && (
              <span className="watchlist-count-badge">{watchlistCount}</span>
            )}
          </NavLink>
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="navbar-search desktop-search">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search movies by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </form>

        {/* User Auth Menu or Login/Register */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="user-menu-wrapper" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="user-profile-btn"
                aria-label="User menu"
              >
                <img
                  src={
                    user?.avatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                  }
                  alt={user?.name || 'User'}
                  className="user-avatar-img"
                />
                <span className="user-name-text">{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={14} className={`chevron-icon ${userMenuOpen ? 'open' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="user-dropdown-menu animate-fade-down">
                  <div className="dropdown-header">
                    <p className="dropdown-user-name">{user?.name}</p>
                    <p className="dropdown-user-email">{user?.email}</p>
                    {isAdmin && (
                      <span className="admin-badge">
                        <Shield size={11} /> Admin
                      </span>
                    )}
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/profile" className="dropdown-item">
                    <User size={16} />
                    <span>Profile & Reviews</span>
                  </Link>
                  <Link to="/watchlist" className="dropdown-item">
                    <Bookmark size={16} />
                    <span>Watchlist ({watchlistCount})</span>
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="dropdown-item dropdown-item-admin">
                      <Shield size={16} />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item dropdown-item-logout">
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons-desktop">
              <Link to="/login" className="btn btn-ghost">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="mobile-menu-toggle"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer animate-fade-down">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="mobile-search-form">
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </form>

          <nav className="mobile-nav-links">
            <NavLink to="/" className="mobile-nav-link" end>
              Home
            </NavLink>
            <NavLink to="/movies" className="mobile-nav-link">
              Browse Movies
            </NavLink>
            <NavLink to="/movies?sort=vote_average.desc" className="mobile-nav-link">
              Top Rated Movies
            </NavLink>
            <NavLink to="/watchlist" className="mobile-nav-link">
              My Watchlist ({watchlistCount})
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/profile" className="mobile-nav-link">
                  My Profile
                </NavLink>
                {isAdmin && (
                  <NavLink to="/admin" className="mobile-nav-link text-purple-400">
                    Admin Dashboard
                  </NavLink>
                )}
                <button onClick={handleLogout} className="mobile-nav-link mobile-logout-btn">
                  Log Out ({user?.name})
                </button>
              </>
            ) : (
              <div className="mobile-auth-actions">
                <Link to="/login" className="btn btn-secondary w-full">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary w-full">
                  Create Account
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
