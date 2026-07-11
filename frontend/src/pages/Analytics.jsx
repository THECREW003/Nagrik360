import { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';

const Analytics = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await analyticsAPI.getDashboard();
        setDashboard(response.data.analytics);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Analytics</h1>
        <p style={styles.subtitle}>View platform-wide performance and complaint trends.</p>
      </div>

      {loading ? (
        <div style={styles.loading}>
          <div style={styles.spinner} />
          <p>Loading analytics...</p>
        </div>
      ) : error ? (
        <div style={styles.error}>{error}</div>
      ) : (
        <>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <span style={styles.statLabel}>Total Complaints</span>
              <span style={styles.statValue}>{dashboard?.overview?.totalComplaints || 0}</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statLabel}>Total Users</span>
              <span style={styles.statValue}>{dashboard?.overview?.totalUsers || 0}</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statLabel}>Total Departments</span>
              <span style={styles.statValue}>{dashboard?.overview?.totalDepartments || 0}</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statLabel}>Resolution Rate</span>
              <span style={styles.statValue}>{dashboard?.overview?.resolutionRate || 0}%</span>
            </div>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Status Breakdown</h2>
            <div style={styles.breakdownGrid}>
              {Object.entries(dashboard?.statusBreakdown || {}).map(([status, count]) => (
                <div key={status} style={styles.breakdownCard}>
                  <span style={styles.breakdownLabel}>{status.replace('_', ' ')}</span>
                  <span style={styles.breakdownValue}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Top Categories</h2>
            <div style={styles.listCard}>
              {(dashboard?.categoryBreakdown || []).map((item) => (
                <div key={item.category} style={styles.listItem}>
                  <span>{item.category}</span>
                  <span>{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Monthly Trends</h2>
            <div style={styles.listCard}>
              {(dashboard?.monthlyTrend || []).map((item) => (
                <div key={item.month} style={styles.listItem}>
                  <span>{item.month}</span>
                  <span>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1080px',
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '24px',
  },
  statCard: {
    background: '#fff',
    padding: '22px',
    borderRadius: '18px',
    border: '1px solid #e8eaf6',
    boxShadow: '0 6px 22px rgba(15, 23, 42, 0.05)',
  },
  statLabel: {
    display: 'block',
    fontSize: '0.9rem',
    color: '#52606d',
    marginBottom: '10px',
  },
  statValue: {
    fontSize: '1.7rem',
    fontWeight: 800,
    color: '#1a237e',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#1a237e',
    marginBottom: '16px',
  },
  breakdownGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '14px',
  },
  breakdownCard: {
    padding: '18px',
    background: '#fff',
    borderRadius: '16px',
    border: '1px solid #e8eaf6',
  },
  breakdownLabel: {
    display: 'block',
    color: '#52606d',
    marginBottom: '8px',
    fontSize: '0.9rem',
  },
  breakdownValue: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#1a237e',
  },
  listCard: {
    background: '#fff',
    borderRadius: '18px',
    border: '1px solid #e8eaf6',
    boxShadow: '0 6px 22px rgba(15, 23, 42, 0.05)',
    overflow: 'hidden',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 22px',
    borderBottom: '1px solid #f1f5f9',
    gap: '12px',
  },
  empty: {
    padding: '26px',
    background: '#f4f6f8',
    borderRadius: '14px',
    textAlign: 'center',
    color: '#64748b',
  },
};

export default Analytics;
