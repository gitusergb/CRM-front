import { useState, useEffect } from 'react';
import api from '../services/api.js';
import { initSocket, getSocket } from '../services/socket.js';
import { useSelector } from 'react-redux';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      // Initialize socket
      initSocket(token);

      // Fetch notifications
      fetchNotifications();
      fetchUnreadCount();

      // Listen for new notifications
      const socket = getSocket();
      if (socket) {
        socket.on('notification', (notification) => {
          setNotifications((prev) => [notification, ...prev]);
          setUnreadCount((prev) => prev + 1);
        });
      }

      return () => {
        if (socket) {
          socket.off('notification');
        }
      };
    }
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications?limit=10');
      setNotifications(response.data.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/notifications/unread/count');
      setUnreadCount(response.data.data.count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read/all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      window.location.href = notification.link;
    }
    setShowDropdown(false);
  };

  return (
    <div style={styles.container}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={styles.bellButton}
      >
        🔔
        {unreadCount > 0 && (
          <span style={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <div style={styles.dropdown}>
          <div style={styles.header}>
            <h3 style={styles.title}>Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} style={styles.markAllBtn}>
                Mark all as read
              </button>
            )}
          </div>
          <div style={styles.list}>
            {notifications.length === 0 ? (
              <div style={styles.empty}>No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  style={{
                    ...styles.notificationItem,
                    backgroundColor: notification.isRead ? '#fff' : '#f0f8ff',
                  }}
                >
                  <div style={styles.notificationContent}>
                    <strong style={styles.notificationTitle}>
                      {notification.title}
                    </strong>
                    <p style={styles.notificationMessage}>
                      {notification.message}
                    </p>
                    <small style={styles.notificationTime}>
                      {new Date(notification.createdAt).toLocaleString()}
                    </small>
                  </div>
                  {!notification.isRead && (
                    <div style={styles.unreadDot}></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
  },
  bellButton: {
    position: 'relative',
    padding: '0.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.5rem',
  },
  badge: {
    position: 'absolute',
    top: '0',
    right: '0',
    backgroundColor: '#dc3545',
    color: 'white',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '0.7rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: '0',
    marginTop: '0.5rem',
    width: '350px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 1000,
    maxHeight: '500px',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '1rem',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: '1.1rem',
  },
  markAllBtn: {
    padding: '0.25rem 0.75rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  list: {
    maxHeight: '400px',
    overflowY: 'auto',
  },
  empty: {
    padding: '2rem',
    textAlign: 'center',
    color: '#666',
  },
  notificationItem: {
    padding: '1rem',
    borderBottom: '1px solid #f0f0f0',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    transition: 'background-color 0.2s',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    display: 'block',
    marginBottom: '0.25rem',
    color: '#333',
  },
  notificationMessage: {
    margin: '0.25rem 0',
    color: '#666',
    fontSize: '0.9rem',
  },
  notificationTime: {
    color: '#999',
    fontSize: '0.8rem',
  },
  unreadDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#007bff',
    marginTop: '0.5rem',
  },
};

export default NotificationBell;

