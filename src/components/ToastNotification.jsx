import React, { useEffect } from 'react';
import '../styles/ToastNotification.css';

const ToastNotification = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(notification.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification.id, onClose]);

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  const handleClose = () => {
    onClose(notification.id);
  };

  return (
    <div className={`toast-notification toast-notification--${notification.type}`}>
      <div className="toast-notification__content">
        <span className="toast-notification__icon">
          {getIcon()}
        </span>
        <span className="toast-notification__message">
          {notification.message}
        </span>
        <button 
          className="toast-notification__close"
          onClick={handleClose}
          aria-label="Cerrar notificación"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;
