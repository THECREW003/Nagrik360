import { useState } from 'react';
import { complaintsAPI } from '../services/api';

const TrackComplaint = () => {
  const [complaintId, setComplaintId] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setComplaint(null);

    try {
      const response = await complaintsAPI.getAll({ search: complaintId, limit: 1 });
      const found = response.data.complaints.find((item) => item.complaintId === complaintId);
      if (!found) {
        setError('No complaint found with that ID.');
      } else {
        setComplaint(found);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to find complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.heroSection}>
        <div style={styles.heroContent}>
          <span style={styles.label}>Track Your Complaint</span>
          <h1 style={styles.heroTitle}>Realtime complaint tracking for citizens</h1>
          <p style={styles.heroText}>
            Enter your complaint ID and get current status, assigned department, timeline,
            and estimated resolution path.
          </p>

          <form onSubmit={handleSearch} style={styles.searchForm}>
            <input
              type="text"
              value={complaintId}
              onChange={(event) => setComplaintId(event.target.value)}
              placeholder="Enter complaint ID (e.g. NGR-ABC123)"
              style={styles.searchInput}
              required
            />
            <button type="submit" disabled={loading} style={styles.searchButton}>
              {loading ? 'Searching...' : 'Track Now'}
            </button>
          </form>
        </div>
      </div>

      <div style={styles.contentArea}>
        {error && <div style={styles.errorBox}>{error}</div>}
        {complaint && (
          <div style={styles.resultCard}>
            <div style={styles.resultHeader}>
              <div>
                <span style={styles.resultBadge}>{complaint.status.replace('_', ' ')}</span>
                <h2 style={styles.resultTitle}>{complaint.title}</h2>
                <p style={styles.resultMeta}>
                  {complaint.complaintId} • {complaint.category} • {complaint.priority}
                </p>
              </div>
              <div style={styles.resultInfo}>
                <span style={styles.resultNumber}>Status</span>
                <span style={styles.resultValue}>{complaint.status.replace('_', ' ')}</span>
              </div>
            </div>

            <div style={styles.timelineSection}>
              <h3 style={styles.sectionTitle}>Timeline</h3>
              {complaint.timeline?.length > 0 ? (
                <div style={styles.timelineList}>
                  {complaint.timeline.map((entry, index) => (
                    <div key={index} style={styles.timelineItem}>
                      <div style={styles.timelinePoint} />
                      <div>
                        <span style={styles.timelineTime}>
                          {new Date(entry.updatedAt).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <p style={styles.timelineRemark}>{entry.remark}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={styles.emptyText}>No timeline updates available yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top left, rgba(59, 130, 246, 0.18), transparent 35%), rgba(238, 242, 255, 0.95)',
    padding: '40px 20px 80px',
  },
  heroSection: {
    maxWidth: '1120px',
    margin: '0 auto 32px',
    borderRadius: '28px',
    background: 'rgba(255,255,255,0.86)',
    backdropFilter: 'blur(18px)',
    border: '1px solid rgba(255,255,255,0.8)',
    boxShadow: '0 30px 80px rgba(15, 23, 42, 0.08)',
    overflow: 'hidden',
    position: 'relative',
  },
  heroContent: {
    padding: '56px 48px',
    maxWidth: '680px',
  },
  label: {
    display: 'inline-flex',
    background: '#eff6ff',
    color: '#1d4ed8',
    borderRadius: '999px',
    padding: '10px 16px',
    fontWeight: 700,
    fontSize: '0.85rem',
    marginBottom: '18px',
  },
  heroTitle: {
    fontSize: '3rem',
    lineHeight: 1.05,
    margin: 0,
    color: '#0f172a',
  },
  heroText: {
    color: '#475569',
    fontSize: '1rem',
    marginTop: '18px',
    maxWidth: '580px',
    lineHeight: 1.75,
  },
  searchForm: {
    display: 'flex',
    gap: '14px',
    marginTop: '32px',
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: 1,
    minWidth: '280px',
    padding: '16px 20px',
    borderRadius: '16px',
    border: '1px solid rgba(148, 163, 184, 0.5)',
    background: '#f8fafc',
    outline: 'none',
    fontSize: '1rem',
    color: '#0f172a',
  },
  searchButton: {
    background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '16px',
    padding: '16px 28px',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 16px 30px rgba(37, 99, 235, 0.2)',
  },
  contentArea: {
    maxWidth: '1120px',
    margin: '0 auto',
  },
  errorBox: {
    background: '#fee2e2',
    border: '1px solid #fecaca',
    borderRadius: '18px',
    padding: '18px 22px',
    color: '#991b1b',
    marginBottom: '24px',
  },
  resultCard: {
    background: '#fff',
    borderRadius: '28px',
    padding: '32px',
    border: '1px solid rgba(229, 231, 235, 0.9)',
    boxShadow: '0 24px 70px rgba(15, 23, 42, 0.08)',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '24px',
    alignItems: 'flex-start',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  resultBadge: {
    display: 'inline-block',
    background: '#eff6ff',
    color: '#1d4ed8',
    padding: '8px 16px',
    borderRadius: '999px',
    fontWeight: 700,
    fontSize: '0.85rem',
    marginBottom: '16px',
  },
  resultTitle: {
    fontSize: '2rem',
    margin: 0,
    color: '#0f172a',
    lineHeight: 1.1,
  },
  resultMeta: {
    color: '#475569',
    fontSize: '0.95rem',
    marginTop: '10px',
  },
  resultInfo: {
    textAlign: 'right',
  },
  resultNumber: {
    display: 'block',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontSize: '0.75rem',
    marginBottom: '8px',
  },
  resultValue: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#1f2937',
  },
  timelineSection: {
    marginTop: '16px',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '18px',
  },
  timelineList: {
    display: 'grid',
    gap: '18px',
  },
  timelineItem: {
    display: 'flex',
    gap: '18px',
    alignItems: 'flex-start',
    padding: '18px',
    background: '#f8fafc',
    borderRadius: '18px',
    border: '1px solid rgba(148, 163, 184, 0.2)',
  },
  timelinePoint: {
    width: '14px',
    height: '14px',
    marginTop: '6px',
    borderRadius: '50%',
    background: '#2563eb',
    flexShrink: 0,
  },
  timelineTime: {
    fontSize: '0.85rem',
    color: '#475569',
    marginBottom: '8px',
    display: 'block',
  },
  timelineRemark: {
    margin: 0,
    color: '#334155',
    lineHeight: 1.7,
  },
  emptyText: {
    color: '#64748b',
    padding: '20px',
    borderRadius: '16px',
    background: '#fff',
    border: '1px solid rgba(148, 163, 184, 0.25)',
  },
};

export default TrackComplaint;
