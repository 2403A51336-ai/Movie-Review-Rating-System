import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Shield,
  MessageSquare,
  Bookmark,
  Calendar,
  Edit2,
  Trash2,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import * as reviewService from '../services/reviewService';
import RatingBadge from '../components/RatingBadge';
import Loader from '../components/Loader';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
];

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { watchlistCount } = useWatchlist();
  const { showToast } = useToast();

  const [profileData, setProfileData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reviews');

  // Edit Profile Form State
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/profile');
      if (res.data.success) {
        setProfileData(res.data);
        setReviews(res.data.reviews || []);
        setName(res.data.user.name || '');
        setAvatar(res.data.user.avatar || '');
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      showToast(err.message || 'Failed to load profile.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const payload = { name, avatar };
      if (newPassword.trim()) {
        payload.password = newPassword.trim();
      }

      const res = await api.put('/users/profile', payload);
      if (res.data.success) {
        showToast('Profile updated successfully!', 'success');
        updateUser(res.data.user);
        setIsEditing(false);
        setNewPassword('');
        fetchProfile();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      const res = await reviewService.deleteReview(reviewId);
      if (res.success) {
        showToast('Review deleted.', 'info');
        fetchProfile();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete review.', 'error');
    }
  };

  if (loading) {
    return <Loader message="Loading your profile and reviews..." fullScreen />;
  }

  const currentUser = profileData?.user || user;
  const stats = profileData?.stats || { totalReviews: reviews.length, watchlistCount };

  return (
    <div className="profile-page app-container">
      {/* Profile Header Banner */}
      <div className="profile-card">
        <div className="profile-card-header">
          {/* Avatar */}
          <div className="profile-avatar-wrapper">
            <img
              src={currentUser?.avatar || AVATAR_PRESETS[0]}
              alt={currentUser?.name}
              className="profile-avatar-img"
            />
          </div>

          {/* User Details */}
          <div className="profile-info-block">
            <div className="profile-name-row">
              <h1 className="profile-name">{currentUser?.name}</h1>
              {currentUser?.role === 'admin' && (
                <span className="admin-pill">
                  <Shield size={12} /> Administrator
                </span>
              )}
            </div>

            <p className="profile-email">
              <Mail size={15} />
              <span>{currentUser?.email}</span>
            </p>

            <p className="profile-joined">
              <Calendar size={14} />
              <span>
                Member since{' '}
                {new Date(currentUser?.createdAt || Date.now()).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </p>
          </div>

          {/* Edit Profile Button */}
          <div className="profile-action-col">
            <button
              onClick={() => setIsEditing((prev) => !prev)}
              className="btn btn-secondary btn-sm"
            >
              <Edit2 size={15} />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Counter Row */}
        <div className="profile-stats-grid">
          <div className="stat-card">
            <MessageSquare size={22} className="text-purple-400" />
            <div className="stat-val">{stats.totalReviews}</div>
            <div className="stat-lbl">Reviews Written</div>
          </div>

          <div className="stat-card">
            <Bookmark size={22} className="text-red-400" />
            <div className="stat-val">{watchlistCount}</div>
            <div className="stat-lbl">Movies in Watchlist</div>
          </div>
        </div>

        {/* Edit Profile Modal / Accordion */}
        {isEditing && (
          <div className="edit-profile-drawer animate-fade-down">
            <h3 className="drawer-title">Update Your Information</h3>
            <form onSubmit={handleUpdateProfile} className="drawer-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              {/* Avatar Selector */}
              <div className="form-group">
                <label className="form-label">Choose Avatar Preset or Custom Image URL</label>
                <div className="avatar-presets-row">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setAvatar(preset)}
                      className={`avatar-preset-btn ${avatar === preset ? 'active' : ''}`}
                    >
                      <img src={preset} alt={`Preset ${idx + 1}`} />
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  placeholder="Or paste an image URL..."
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="form-input mt-2"
                />
              </div>

              {/* Password (Optional) */}
              <div className="form-group">
                <label className="form-label">New Password (leave blank to keep unchanged)</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-input"
                  minLength={6}
                />
              </div>

              <div className="drawer-actions">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-primary"
                >
                  {isSaving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="profile-tabs-bar">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`profile-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
        >
          <MessageSquare size={16} />
          <span>My Reviews ({reviews.length})</span>
        </button>
        <Link to="/watchlist" className="profile-tab-btn">
          <Bookmark size={16} />
          <span>My Watchlist ({watchlistCount})</span>
        </Link>
      </div>

      {/* Reviews Content */}
      <div className="profile-reviews-content">
        {reviews.length === 0 ? (
          <div className="empty-state-card">
            <MessageSquare size={48} className="empty-icon text-slate-600" />
            <h3 className="empty-title">You haven't written any reviews yet</h3>
            <p className="empty-subtitle">
              Browse movies and share your thoughts to start building your CineReview critic profile.
            </p>
            <Link to="/movies" className="btn btn-primary mt-4">
              Explore Movies to Review
            </Link>
          </div>
        ) : (
          <div className="user-reviews-list">
            {reviews.map((rev) => (
              <div key={rev._id} className="user-review-row-card">
                <div className="user-review-left">
                  <div className="flex items-center gap-3 mb-2">
                    <RatingBadge rating={rev.rating} size="sm" showMax />
                    <span className="text-xs text-slate-400">
                      {new Date(rev.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <h4 className="user-review-title">{rev.reviewTitle}</h4>
                  <p className="user-review-text">{rev.reviewText}</p>
                </div>

                <div className="user-review-actions">
                  <Link
                    to={`/movie/${rev.movieId}`}
                    className="btn btn-secondary btn-sm"
                    title="View movie and review"
                  >
                    <ExternalLink size={14} />
                    <span>View Movie</span>
                  </Link>

                  <button
                    onClick={() => handleDeleteReview(rev._id)}
                    className="btn btn-ghost btn-sm text-red-400 hover:text-red-300"
                    title="Delete review"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
