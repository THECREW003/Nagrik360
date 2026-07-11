import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI, complaintsAPI } from '../services/api';
import ComplaintCard from '../components/ComplaintCard';

const Dashboard = () => {
  const { user, isAdmin, isOfficial } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAdmin) {
          const [analyticsRes, complaintsRes] = await Promise.all([
            analyticsAPI.getDashboard(),
            complaintsAPI.getAll({ limit: 5, sort: '-createdAt' }),
          ]);
          setStats(analyticsRes.data.analytics);
          setRecentComplaints(complaintsRes.data.complaints);
        } else {
          const [statsRes, complaintsRes] = await Promise.all([
            analyticsAPI.getMyStats(),
            complaintsAPI.getAll({ limit: 5, sort: '-createdAt' }),
          ]);
          setStats(statsRes.data.stats);
          setRecentComplaints(complaintsRes.data.complaints);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdmin]);

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.welcome}>
        <h1 style={styles.welcomeTitle}>
          Welcome, {user?.name || 'User'}! 👋
        </h1>
        <p style={styles.welcomeSub}>
          {isAdmin
            ? 'Here\'s your admin overview of the Nagrik360 platform.'
            : 'Here\'s your personal complaint activity overview.'}
        </p>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        {isAdmin ? (
          <>
            <div style={styles.statCard}>
              <span style={styles.statIcon}>📋</span>
              <span style={styles.statValue}>{stats?.overview?.totalComplaints || 0}</span>
              <span style={styles.statLabel}>Total Complaints</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statIcon}>👥</span>
              <span style={styles.statValue}>{stats?.overview?.totalUsers || 0}</span>
              <span style={styles.statLabel}>Active Users</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statIcon}>🏢</span>
              <span style={styles.statValue}>{stats?.overview?.totalDepartments || 0}</span>
              <span style={styles.statLabel}>Departments</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statIcon}>✅</span>
              <span style={styles.statValue}>{stats?.overview?.resolutionRate || 0}%</span>
              <span style={styles.statLabel}>Resolution Rate</span>
            </div>
          </>
        ) : (
          <>
            <div style={styles.statCard}>
              <span style={styles.statIcon}>📋</span>
              <span style={styles.statValue}>{stats?.totalComplaints || 0}</span>
              <span style={styles.statLabel}>My Complaints</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statIcon}>✅</span>
              <span style={styles.statValue}>{stats?.resolvedComplaints || 0}</span>
              <span style={styles.statLabel}>Resolved</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statIcon}>⏳</span>
              <span style={styles.statValue}>{stats?.pendingComplaints || 0}</span>
              <span style={styles.statLabel}>Pending</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statIcon}>🏆</span>
              <span style={styles.statValue}>{stats?.rewardPoints || 0}</span>
              <span style={styles.statLabel}>Reward Points</span>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div style={styles.actions}>
        <button onClick={() => navigate('/create-complaint')} style={styles.actionBtn}>
          📝 File New Complaint
        </button>
        <button onClick={() => navigate('/complaints')} style={styles.actionBtnSecondary}>
          📋 View All Complaints
        </button>
      </div>

      {/* Recent Complaints */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Recent Complaints</h2>
        {recentComplaints.length > 0 ? (
          <div style={styles.complaintGrid}>
            {recentComplaints.map((complaint) => (
              <ComplaintCard key={complaint._id} complaint={complaint} />
            ))}
          </div>
        ) : (
          <div style={styles.empty}>
            <p>No complaints yet. File your first complaint!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
    color: '#666',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e8eaf6',
    borderTop: '4px solid #1a237e',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  error: {
    background: '#ffebee',
    color: '#c62828',
    padding: '16px',
    margin: '20px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  welcome: {
    marginBottom: '30px',
  },
  welcomeTitle: {
    fontSize: '1.8rem',
    fontWeight: 700,
    color: '#1a237e',
    margin: '0 0 8px 0',
  },
  welcomeSub: {
    fontSize: '1rem',
    color: '#666',
    margin: 0,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '30px',
  },
  statCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    border: '1px solid #e8eaf6',
  },
  statIcon: {
    fontSize: '2rem',
    display: 'block',
    marginBottom: '10px',
  },
  statValue: {
    display: 'block',
    fontSize: '1.8rem',
    fontWeight: 800,
    color: '#1a237e',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '0.85rem',
    color: '#888',
    fontWeight: 500,
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  actionBtn: {
    background: 'linear-gradient(135deg, #ff6f00 0%, #ff8f00 100%)',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  actionBtnSecondary: {
    background: '#fff',
    color: '#1a237e',
    padding: '12px 24px',
    borderRadius: '8px',
    border: '2px solid #1a237e',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#1a237e',
    margin: '0 0 16px 0',
  },
  complaintGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '16px',
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    background: '#fff',
    borderRadius: '12px',
    border: '2px dashed #e0e0e0',
    color: '#888',
  },
};

export default Dashboard;