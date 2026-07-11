import { Link } from 'react-router-dom';

const statusColors = {
  pending: { bg: '#fff3e0', text: '#e65100', label: 'Pending' },
  under_review: { bg: '#e3f2fd', text: '#1565c0', label: 'Under Review' },
  in_progress: { bg: '#e8f5e9', text: '#2e7d32', label: 'In Progress' },
  resolved: { bg: '#e8f5e9', text: '#1b5e20', label: 'Resolved' },
  rejected: { bg: '#ffebee', text: '#c62828', label: 'Rejected' },
  closed: { bg: '#f5f5f5', text: '#616161', label: 'Closed' },
};

const priorityColors = {
  low: '#4caf50',
  medium: '#ff9800',
  high: '#f44336',
  critical: '#d32f2f',
};

const ComplaintCard = ({ complaint }) => {
  const statusInfo = statusColors[complaint.status] || statusColors.pending;

  return (
    <Link to={`/complaints/${complaint._id}`} style={styles.card}>
      <div style={styles.header}>
        <span style={styles.complaintId}>{complaint.complaintId}</span>
        <span style={{ ...styles.priority, background: priorityColors[complaint.priority] || '#999' }}>
          {complaint.priority}
        </span>
      </div>

      <h3 style={styles.title}>{complaint.title}</h3>
      <p style={styles.description}>
        {complaint.description?.substring(0, 150)}
        {complaint.description?.length > 150 ? '...' : ''}
      </p>

      <div style={styles.meta}>
        <span style={styles.category}>{complaint.category}</span>
        <span style={{ ...styles.status, background: statusInfo.bg, color: statusInfo.text }}>
          {statusInfo.label}
        </span>
      </div>

      <div style={styles.footer}>
        <span style={styles.date}>
          {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
        <span style={styles.upvotes}>
          👍 {complaint.upvoteCount || 0}
        </span>
      </div>

      {complaint.aiClassification?.safety_score > 0 && (
        <div style={styles.aiScores}>
          <span style={styles.score} title="Safety Score">
            🛡️ {complaint.aiClassification.safety_score}
          </span>
          <span style={styles.score} title="Severity Score">
            ⚠️ {complaint.aiClassification.severity_score}
          </span>
          <span style={styles.score} title="Time Sensitivity">
            ⏱️ {complaint.aiClassification.time_sensitivity_score}
          </span>
        </div>
      )}
    </Link>
  );
};

const styles = {
  card: {
    display: 'block',
    background: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    border: '1px solid #e8eaf6',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  complaintId: {
    fontSize: '0.75rem',
    color: '#888',
    fontFamily: 'monospace',
    fontWeight: 600,
  },
  priority: {
    fontSize: '0.7rem',
    color: '#fff',
    padding: '3px 10px',
    borderRadius: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: '1.05rem',
    fontWeight: 600,
    color: '#1a237e',
    margin: '0 0 8px 0',
    lineHeight: 1.3,
  },
  description: {
    fontSize: '0.85rem',
    color: '#666',
    lineHeight: 1.5,
    margin: '0 0 14px 0',
  },
  meta: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
    flexWrap: 'wrap',
  },
  category: {
    fontSize: '0.75rem',
    background: '#e8eaf6',
    color: '#283593',
    padding: '4px 10px',
    borderRadius: '6px',
    fontWeight: 500,
  },
  status: {
    fontSize: '0.75rem',
    padding: '4px 10px',
    borderRadius: '6px',
    fontWeight: 500,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.8rem',
    color: '#888',
    borderTop: '1px solid #f0f0f0',
    paddingTop: '12px',
  },
  date: {},
  upvotes: {
    fontWeight: 500,
  },
  aiScores: {
    display: 'flex',
    gap: '12px',
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '1px dashed #e0e0e0',
  },
  score: {
    fontSize: '0.75rem',
    color: '#555',
  },
};

export default ComplaintCard;