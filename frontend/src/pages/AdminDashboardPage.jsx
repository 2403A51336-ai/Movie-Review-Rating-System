import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield,
  Users,
  MessageSquare,
  Film,
  Star,
  Trash2,
  Calendar,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import * as adminService from '../services/adminService';
import { useToast } from '../context/ToastContext';
import RatingBadge from '../components/RatingBadge';
import Loader from '../components/Loader';

const AdminDashboardPage = () => {
  const { showToast } = useToast();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReviews: 0,
    totalMovies: 0,
    platformAvgRating: 0,
  });
  const [reviews, setReviews] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' | 'users'
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, reviewsRes, usersRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAllReviews(),
        adminService.getAllUsers(),
      ]);

      if (statsRes.success) {
        setStats(statsRes.stats);
      }
      if (reviewsRes.success) {
        setReviews(reviewsRes.reviews || []);
      }
      if (usersRes.success) {
        setUsersList(usersRes.users || []);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      showToast(err.message || 'Failed to load administrator data.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review from the platform?')) return;
    try {
      setIsDeleting(true);
      const res = await adminService.deleteReviewAdmin(reviewId);
      if (res.success) {
        showToast('Review removed by administrator.', 'success');
        fetchAdminData();
      }
    } catch (err) {
      showToast(err.message || 'Could not delete review.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Delete user "${userName}" and all their reviews permanently?`)) return;
    try {
      setIsDeleting(true);
      const res = await adminService.deleteUserAdmin(userId);
      if (res.success) {
        showToast(`User "${userName}" deleted.`, 'success');
        fetchAdminData();
      }
    } catch (err) {
      showToast(err.message || 'Could not delete user.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <Loader message="Loading admin telemetry and moderation dashboard..." fullScreen />;
  }

  return (
    <div className="admin-page app-container">
      {/* Header */}
      <div className="admin-header-bar">
        <div className="admin-title-group">
          <div className="admin-shield-icon">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="page-heading">
              Admin <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="page-subheading">
              Platform administration, statistics overview, and community moderation controls.
            </p>
          </div>
        </div>

        <button
          onClick={fetchAdminData}
          className="btn btn-secondary btn-sm"
          title="Refresh statistics"
        >
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon-wrap text-blue-400 bg-blue-500/10">
            <Users size={24} />
          </div>
          <div>
            <div className="admin-stat-number">{stats.totalUsers}</div>
            <div className="admin-stat-title">Registered Users</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrap text-purple-400 bg-purple-500/10">
            <MessageSquare size={24} />
          </div>
          <div>
            <div className="admin-stat-number">{stats.totalReviews}</div>
            <div className="admin-stat-title">Platform Reviews</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrap text-amber-400 bg-amber-500/10">
            <Star size={24} />
          </div>
          <div>
            <div className="admin-stat-number">
              {stats.platformAvgRating > 0 ? stats.platformAvgRating.toFixed(1) : 'N/A'}
            </div>
            <div className="admin-stat-title">Average Platform Rating</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrap text-emerald-400 bg-emerald-500/10">
            <Film size={24} />
          </div>
          <div>
            <div className="admin-stat-number">{stats.totalMovies}</div>
            <div className="admin-stat-title">Movies in Database</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs-bar">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`admin-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
        >
          <MessageSquare size={16} />
          <span>Manage Reviews ({reviews.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
        >
          <Users size={16} />
          <span>Manage Users ({usersList.length})</span>
        </button>
      </div>

      {/* Tab 1: Manage Reviews */}
      {activeTab === 'reviews' && (
        <div className="admin-content-card">
          <div className="card-header-flex">
            <h3 className="card-heading">All Community Reviews</h3>
            <span className="text-xs text-slate-400">
              Review and moderate inappropriate or abusive submissions
            </span>
          </div>

          {reviews.length === 0 ? (
            <div className="empty-state-card py-10">
              <MessageSquare size={36} className="empty-icon text-slate-600" />
              <p className="text-slate-400 mt-2">No reviews have been posted yet.</p>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Reviewer</th>
                    <th>Movie ID</th>
                    <th>Rating</th>
                    <th>Review Title & Content</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((rev) => (
                    <tr key={rev._id}>
                      <td>
                        <div className="reviewer-cell">
                          <img
                            src={
                              rev.userId?.avatar ||
                              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                            }
                            alt=""
                            className="reviewer-cell-avatar"
                          />
                          <div>
                            <div className="font-semibold text-white">
                              {rev.userId?.name || 'Deleted User'}
                            </div>
                            <div className="text-xs text-slate-400">{rev.userId?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <a
                          href={`/movie/${rev.movieId}`}
                          className="table-movie-link"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span>#{rev.movieId}</span>
                          <ExternalLink size={12} />
                        </a>
                      </td>
                      <td>
                        <RatingBadge rating={rev.rating} size="sm" showMax />
                      </td>
                      <td className="max-w-md">
                        <div className="font-semibold text-white truncate">{rev.reviewTitle}</div>
                        <p className="text-xs text-slate-400 line-clamp-2">{rev.reviewText}</p>
                      </td>
                      <td className="text-xs text-slate-400 whitespace-nowrap">
                        {new Date(rev.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteReview(rev._id)}
                          disabled={isDeleting}
                          className="btn-table-delete"
                          title="Delete inappropriate review"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Manage Users */}
      {activeTab === 'users' && (
        <div className="admin-content-card">
          <div className="card-header-flex">
            <h3 className="card-heading">Registered Users Directory</h3>
            <span className="text-xs text-slate-400">Total registered members on CineReview</span>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="reviewer-cell">
                        <img
                          src={
                            u.avatar ||
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                          }
                          alt=""
                          className="reviewer-cell-avatar"
                        />
                        <div>
                          <div className="font-semibold text-white">{u.name}</div>
                          <div className="text-xs text-slate-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`role-badge ${
                          u.role === 'admin' ? 'role-badge-admin' : 'role-badge-user'
                        }`}
                      >
                        {u.role === 'admin' ? (
                          <>
                            <Shield size={11} /> Admin
                          </>
                        ) : (
                          'User'
                        )}
                      </span>
                    </td>
                    <td className="text-xs text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td>
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          disabled={isDeleting}
                          className="btn-table-delete"
                          title="Delete user account"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
