import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationsAPI } from '../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await notificationsAPI.getAll({ limit: 50 });
        setNotifications(response.data.notifications);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Notifications</h1>
        <p style={styles.subtitle}>Stay updated on complaint status, rewards, and system alerts.</p>
      </div>

      {loading ? (
        <div style={styles.loading}>
          <div style={styles.spinner} />
          <p>Loading notifications...</p>
        </div>
      ) : error ? (
        <div style={styles.error}>{error}</div>
      ) : notifications.length === 0 ? (
        <div style={styles.empty}>No notifications available.</div>
      ) : (
        <div style={styles.list}>
          {notifications.map((notification) => (
            <div key={notification._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.notificationType}>{notification.type.replace('_', ' ')}</span>
                <span style={styles.notificationTime}>
                  {new Date(notification.createdAt).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <h2 style={styles.notificationTitle}>{notification.title}</h2>
              <p style={styles.notificationMessage}>{notification.message}</p>
              {notification.complaint && (
                <p style={styles.notificationDetail}>
                  Complaint:{' '}
                  <Link to={`/complaints/${notification.complaint._id}`} style={styles.complaintLink}>
                    {notification.complaint.complaintId} - {notification.complaint.title}
                  </Link>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1020px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  header: {
    marginBottom: '24px',
  },
  title: {
    fontSize: '1.9rem',
    fontWeight: 700,
    color: '#1a237e',
    margin: 0,
  },
  subtitle: {
    color: '#52606d',
    marginTop: '8px',
    fontSize: '0.95rem',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '220px',
    color: '#64748b',
  },
  spinner: {
    width: '36px',
    height: '36px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #1a237e',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  error: {
    padding: '18px',
    background: '#ffebee',
    borderRadius: '14px',
    color: '#c62828',
    border: '1px solid #ef9a9a',
  },
  empty: {
    padding: '26px',
    background: '#f4f6f8',
    borderRadius: '14px',
    textAlign: 'center',
    color: '#64748b',
  },
  list: {
    display: 'grid',
    gap: '18px',
  },
  card: {
    background: '#fff',
    padding: '22px',
    borderRadius: '18px',
    border: '1px solid #e8eaf6',
    boxShadow: '0 6px 22px rgba(15, 23, 42, 0.05)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    gap: '12px',
    flexWrap: 'wrap',
  },
  notificationType: {
    color: '#1a237e',
    fontWeight: 700,
    textTransform: 'capitalize',
    fontSize: '0.85rem',
  },
  notificationTime: {
    color: '#64748b',
    fontSize: '0.8rem',
  },
  notificationTitle: {
    margin: '0 0 10px 0',
    fontSize: '1.05rem',
    color: '#102a43',
  },
  notificationMessage: {
    margin: 0,
    color: '#334e68',
    lineHeight: 1.75,
  },
  notificationDetail: {
    marginTop: '14px',
    color: '#475569',
    fontSize: '0.9rem',
  },
};

export default Notifications;
