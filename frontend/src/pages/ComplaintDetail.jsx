import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { complaintsAPI } from '../services/api';

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadComplaint = async () => {
      try {
        const response = await complaintsAPI.getById(id);
        setComplaint(response.data.complaint);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load complaint details');
      } finally {
        setLoading(false);
      }
    };
    loadComplaint();
  }, [id]);

  const renderMedia = (media) => {
    if (!media || media.length === 0) return null;

    return (
      <div style={styles.mediaGrid}>
        {media.map((item) => (
          <div key={item.publicId || item.url} style={styles.mediaCard}>
            {item.type === 'image' && (
              <img src={item.url} alt="Complaint media" style={styles.mediaImage} />
            )}
            {item.type === 'audio' && (
              <audio controls style={styles.mediaAudio}>
                <source src={item.url} />
                Your browser does not support audio playback.
              </audio>
            )}
            {item.type === 'video' && (
              <video controls style={styles.mediaVideo}>
                <source src={item.url} />
                Your browser does not support video playback.
              </video>
            )}
            <span style={styles.mediaLabel}>{item.type.toUpperCase()}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
        <p>Loading complaint details...</p>
      </div>
    );
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  if (!complaint) {
    return <div style={styles.empty}>Complaint not found.</div>;
  }

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        ← Back to complaints
      </button>

      <div style={styles.header}>
        <div>
          <span style={styles.complaintId}>{complaint.complaintId}</span>
          <h1 style={styles.title}>{complaint.title}</h1>
        </div>
        <div style={styles.badgeRow}>
          <span style={{ ...styles.badge, background: '#e8f5e9', color: '#2e7d32' }}>
            {complaint.status.replace('_', ' ')}
          </span>
          <span style={{ ...styles.badge, background: '#ede7f6', color: '#4527a0' }}>
            {complaint.priority}
          </span>
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Complaint Details</h2>
          <div style={styles.detailRow}>
            <span style={styles.label}>Category</span>
            <span style={styles.value}>{complaint.category}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.label}>Department</span>
            <span style={styles.value}>{complaint.department?.name || 'Unassigned'}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.label}>Submitted by</span>
            <span style={styles.value}>{complaint.user?.name || 'Unknown'}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.label}>Location</span>
            <span style={styles.value}>
              {complaint.location?.address || 'Coordinates:'}{' '}
              {complaint.location?.coordinates?.join(', ')}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.label}>Submitted on</span>
            <span style={styles.value}>
              {new Date(complaint.createdAt).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div style={styles.detailBlock}>
            <span style={styles.label}>Description</span>
            <p style={styles.description}>{complaint.description}</p>
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>AI Classification</h2>
          <div style={styles.detailRow}>
            <span style={styles.label}>AI Category</span>
            <span style={styles.value}>{complaint.aiClassification.category || 'N/A'}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.label}>AI Priority</span>
            <span style={styles.value}>{complaint.aiClassification.priority || 'N/A'}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.label}>Safety Score</span>
            <span style={styles.value}>{complaint.aiClassification.safety_score || 0}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.label}>Severity Score</span>
            <span style={styles.value}>{complaint.aiClassification.severity_score || 0}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.label}>Time Sensitivity</span>
            <span style={styles.value}>{complaint.aiClassification.time_sensitivity_score || 0}</span>
          </div>
          {complaint.aiClassification.summary && (
            <div style={styles.detailBlock}>
              <span style={styles.label}>AI Summary</span>
              <p style={styles.description}>{complaint.aiClassification.summary}</p>
            </div>
          )}
        </div>
      </div>

      {renderMedia(complaint.media)}

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Complaint Timeline</h2>
        {complaint.timeline && complaint.timeline.length > 0 ? (
          <div style={styles.timeline}>
            {complaint.timeline.map((entry, index) => (
              <div key={index} style={styles.timelineItem}>
                <span style={styles.timelineStatus}>{entry.status.replace('_', ' ')}</span>
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
            ))}
          </div>
        ) : (
          <p style={styles.empty}>No timeline updates available yet.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '30px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  backButton: {
    alignSelf: 'flex-start',
    background: 'transparent',
    border: '1px solid #1a237e',
    color: '#1a237e',
    padding: '10px 18px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'flex-start',
  },
  complaintId: {
    display: 'inline-block',
    marginBottom: '10px',
    color: '#555',
    fontSize: '0.85rem',
    fontFamily: 'monospace',
  },
  title: {
    margin: 0,
    fontSize: '2rem',
    color: '#1a237e',
  },
  badgeRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  badge: {
    padding: '8px 14px',
    borderRadius: '999px',
    fontWeight: 700,
    textTransform: 'capitalize',
    fontSize: '0.85rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr',
    gap: '20px',
  },
  card: {
    background: '#fff',
    padding: '26px',
    borderRadius: '18px',
    boxShadow: '0 8px 26px rgba(15, 23, 42, 0.08)',
    border: '1px solid #e8eaf6',
  },
  sectionTitle: {
    margin: '0 0 18px 0',
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#1a237e',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '14px',
  },
  label: {
    fontSize: '0.85rem',
    color: '#556',
    fontWeight: 600,
  },
  value: {
    color: '#1f2937',
    fontWeight: 600,
    minWidth: '200px',
  },
  detailBlock: {
    marginTop: '16px',
  },
  description: {
    margin: '8px 0 0 0',
    lineHeight: 1.8,
    color: '#455a64',
  },
  mediaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '16px',
  },
  mediaCard: {
    background: '#f9fafb',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid #e0e7ff',
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    display: 'block',
    objectFit: 'cover',
    minHeight: '180px',
  },
  mediaAudio: {
    width: '100%',
    borderRadius: '0 0 16px 16px',
  },
  mediaVideo: {
    width: '100%',
    display: 'block',
    minHeight: '180px',
  },
  mediaLabel: {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    background: 'rgba(0,0,0,0.65)',
    color: '#fff',
    borderRadius: '999px',
    padding: '6px 12px',
    fontSize: '0.7rem',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  timelineItem: {
    background: '#f7f9fc',
    borderRadius: '14px',
    padding: '18px',
    border: '1px solid #dde7f4',
  },
  timelineStatus: {
    display: 'block',
    fontWeight: 700,
    color: '#1a237e',
    marginBottom: '6px',
    fontSize: '0.95rem',
    textTransform: 'capitalize',
  },
  timelineTime: {
    fontSize: '0.8rem',
    color: '#64748b',
    marginBottom: '10px',
    display: 'block',
  },
  timelineRemark: {
    margin: 0,
    color: '#374151',
    lineHeight: 1.7,
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '250px',
    color: '#62718d',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #1a237e',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  error: {
    margin: '30px auto',
    padding: '20px',
    maxWidth: '700px',
    borderRadius: '14px',
    background: '#ffebee',
    color: '#c62828',
    border: '1px solid #ef9a9a',
  },
  empty: {
    margin: '30px auto',
    padding: '30px',
    maxWidth: '700px',
    textAlign: 'center',
    background: '#fff9c4',
    borderRadius: '14px',
    color: '#795548',
  },
};

export default ComplaintDetail;
