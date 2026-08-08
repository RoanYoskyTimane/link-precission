import React, { useState, useEffect } from 'react';
import './EditModal.css';

interface EditModalProps {
  isOpen: boolean;
  shortCode: string;
  currentUrl: string;
  onClose: () => void;
  onSave: (shortCode: string, newUrl: string) => Promise<void>;
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  shortCode,
  currentUrl,
  onClose,
  onSave,
  addToast,
}) => {
  const [newUrl, setNewUrl] = useState(currentUrl);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setNewUrl(currentUrl);
  }, [currentUrl, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let targetUrl = newUrl.trim();

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
      addToast('error', 'Please enter a valid URL');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(shortCode, targetUrl);
      onClose();
    } catch {
      // Caller handles error/toast
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Edit Short Link</h2>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="modal-info-row">
              <span className="modal-info-label">Short Code</span>
              <span className="modal-info-value">/{shortCode}</span>
            </div>

            <div className="modal-input-group">
              <label className="modal-info-label" htmlFor="edit-url-input">
                Destination URL
              </label>
              <div className="modal-input-wrapper">
                <input
                  id="edit-url-input"
                  type="text"
                  className="modal-input"
                  placeholder="https://example.com"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  disabled={isSaving}
                  autoFocus
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="modal-btn cancel"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn save"
              disabled={isSaving || newUrl.trim() === currentUrl}
            >
              {isSaving ? (
                <>
                  <span className="modal-spinner" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
