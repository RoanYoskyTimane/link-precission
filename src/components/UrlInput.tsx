import React, { useState } from 'react';
import './UrlInput.css';

interface UrlInputProps {
  onShorten: (url: string) => Promise<void>;
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const UrlInput: React.FC<UrlInputProps> = ({ onShorten, addToast }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let targetUrl = url.trim();
    if (!targetUrl) {
      addToast('error', 'Please enter a URL');
      return;
    }

    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    try {
      new URL(targetUrl);
    } catch {
      addToast('error', 'Please enter a valid URL (e.g., google.com)');
      return;
    }

    setIsLoading(true);
    try {
      await onShorten(targetUrl);
      setUrl('');
    } catch {
      // Caller handles error toasts
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="url-input-section-container">
      <form onSubmit={handleSubmit}>
        <div className="url-input-bar-wrapper">
          <div className="url-input-bar-inner">
            <span className="material-symbols-outlined url-input-bar-icon">link</span>
            <input
              type="text"
              className="url-input-bar-field"
              placeholder="Paste your long URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="url-input-bar-btn" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="url-input-btn-spinner" />
                  Shortening...
                </>
              ) : (
                'Shorten URL'
              )}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};
