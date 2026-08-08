import React from 'react';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="app-footer-container">
        <div className="footer-brand">Link Precision</div>
        <div className="footer-links">
          <a href="#" className="footer-link">Terms of Service</a>
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">API Documentation</a>
          <a href="#" className="footer-link">Support</a>
        </div>
        <div className="footer-copy">© 2026 Link Precision. All rights reserved.</div>
      </div>
    </footer>
  );
};
