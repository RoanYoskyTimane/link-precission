import React, { useEffect, useState } from 'react';
import './Notification.css';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: (id: string) => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ id, type, message, onClose, duration = 4000 }) => {
  const [progressWidth, setProgressWidth] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPercent = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgressWidth(remainingPercent);
      if (elapsed >= duration) {
        clearInterval(interval);
        onClose(id);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`toast ${type}`}>
      <span className="toast-icon">{getIcon()}</span>
      <div className="toast-content">{message}</div>
      <button className="toast-close" onClick={() => onClose(id)}>
        &times;
      </button>
      <div className="toast-progress">
        <div 
          className="toast-progress-bar" 
          style={{ width: `${progressWidth}%`, transition: 'none' }}
        />
      </div>
    </div>
  );
};

interface NotificationContainerProps {
  toasts: ToastMessage[];
  onRemoveToast: (id: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  toasts,
  onRemoveToast,
}) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={onRemoveToast}
        />
      ))}
    </div>
  );
};
