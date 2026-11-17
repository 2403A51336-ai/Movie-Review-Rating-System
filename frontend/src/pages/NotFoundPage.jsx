import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="not-found-page app-container">
      <div className="not-found-card">
        <div className="not-found-badge">404 ERROR</div>
        <h1 className="not-found-title">Scene Not Found</h1>
        <p className="not-found-text">
          The page or movie reel you are looking for has been cut from the final edit.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            <Home size={16} />
            <span>Return Home</span>
          </Link>
          <Link to="/movies" className="btn btn-secondary">
            <Film size={16} />
            <span>Browse Movies</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
