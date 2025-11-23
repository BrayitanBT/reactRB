import './notification.css';

export default function Notification({ message, type = 'success', onClose, show }) {
  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '✅';
    }
  };

  return (
    <div className={`notification notification-${type} ${show ? 'notification-show' : ''}`}>
      <div className="notification-content">
        <span className="notification-icon">{getIcon()}</span>
        <span className="notification-message">{message}</span>
      </div>
      <button onClick={onClose} className="notification-close">
        ×
      </button>
    </div>
  );
}