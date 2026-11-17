import React from 'react';
import { Film } from 'lucide-react';

const Loader = ({ message = 'Loading CineReview...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        <div className="loader-spinner-wrapper">
          <Film className="loader-icon animate-pulse" size={48} />
          <div className="loader-ring"></div>
        </div>
        <p className="loader-text">{message}</p>
      </div>
    );
  }

  return (
    <div className="loader-inline">
      <div className="loader-spinner"></div>
      {message && <span className="loader-text">{message}</span>}
    </div>
  );
};

export default Loader;
