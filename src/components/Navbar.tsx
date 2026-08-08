import React from 'react';
import './Navbar.css';

export const Navbar: React.FC = () => {
  return (
    <nav className="app-nav">
      <div className="app-nav-container">
        <div className="app-nav-brand">
          <a href="#" className="app-brand-logo">Link Precision</a>
          <div className="app-nav-links">
            <a href="#" className="app-nav-link active">Dashboard</a>
            <a href="#" className="app-nav-link">Link History</a>
          </div>
        </div>
        <div className="app-nav-profile">
          <button className="profile-btn" title="Profile">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
