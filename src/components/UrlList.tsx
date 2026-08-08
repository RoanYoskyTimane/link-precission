import React, { useState } from 'react';
import './UrlList.css';

export interface UrlItemType {
  id: number;
  url: string;
  shortCode: string;
  createdAt: string;
  updatedAt: string;
  accessCount?: number;
}

interface UrlListProps {
  items: UrlItemType[];
  onEdit: (item: UrlItemType) => void;
  onDelete: (shortCode: string) => Promise<void>;
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
  redirectBaseUrl: string;
}

export const UrlList: React.FC<UrlListProps> = ({ items, onEdit, onDelete, addToast, redirectBaseUrl }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = async (shortCode: string) => {
    const shortLink = `${redirectBaseUrl}/${shortCode}`;
    try {
      await navigator.clipboard.writeText(shortLink);
      setCopiedCode(shortCode);
      addToast('success', `Copied short link /${shortCode} to clipboard!`);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      addToast('error', 'Failed to copy to clipboard');
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.shortCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cleanDisplayBaseUrl = redirectBaseUrl.replace(/^https?:\/\//i, '');

  return (
    <section className="urllist-section">
      <div className="urllist-title-bar">
        <h2 className="urllist-title-text">Recent Links</h2>
        <div className="urllist-search-box">
          <span className="material-symbols-outlined urllist-search-icon-symbol">search</span>
          <input
            type="text"
            className="urllist-search-field"
            placeholder="Search URL or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="urllist-card">
        {/* Table Header Row */}
        <div className="urllist-grid-header">
          <div className="col-span-5">Original URL</div>
          <div className="col-span-3">Short Link</div>
          <div className="col-span-2 text-right-desktop">Clicks</div>
          <div className="col-span-2 text-right-desktop">Actions</div>
        </div>

        {/* Table Rows */}
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const isCopied = copiedCode === item.shortCode;
            const shortLink = `${redirectBaseUrl}/${item.shortCode}`;
            return (
              <div key={item.shortCode} className="urllist-grid-row">
                {/* Original URL */}
                <div className="col-span-5 url-cell-original" title={item.url}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.url}
                  </a>
                </div>

                {/* Short Link */}
                <div className="col-span-3 url-cell-short">
                  <a
                    href={shortLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="url-cell-short-anchor"
                  >
                    {cleanDisplayBaseUrl}/{item.shortCode}
                  </a>
                  <button
                    className={`url-copy-icon-btn ${isCopied ? 'copied' : ''}`}
                    onClick={() => handleCopy(item.shortCode)}
                    title="Copy short link"
                  >
                    <span className="material-symbols-outlined">
                      {isCopied ? 'check' : 'content_copy'}
                    </span>
                  </button>
                </div>

                {/* Clicks */}
                <div className="col-span-2 url-cell-clicks text-right-desktop">
                  {(item.accessCount ?? 0).toLocaleString()}
                </div>

                {/* Actions */}
                <div className="col-span-2 url-cell-actions">
                  <button
                    className="url-action-icon-btn edit"
                    onClick={() => onEdit(item)}
                    title="Edit URL destination"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button
                    className="url-action-icon-btn delete"
                    onClick={() => onDelete(item.shortCode)}
                    title="Delete shortcode link"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="urllist-empty-state">
            <span className="material-symbols-outlined urllist-empty-icon">folder_open</span>
            <div className="urllist-empty-title">
              {searchTerm ? 'No results match' : 'No shortened links'}
            </div>
            <div className="urllist-empty-desc">
              {searchTerm
                ? 'Try editing your search query'
                : 'Paste a link in the input form above to generate a short URL.'}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
