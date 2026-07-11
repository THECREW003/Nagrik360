import React from 'react';

const AdminTopbar = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <h2 style={styles.pageTitle}>Admin Dashboard</h2>
      </div>
      <div style={styles.right}>
        <div style={styles.info}>
          <div style={styles.name}>{user?.name || 'Official'}</div>
          <div style={styles.dept}>{user?.department || 'Department'}</div>
        </div>
        <div style={styles.profile}>👤</div>
        <div style={styles.bell}>🔔</div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 0',
    borderBottom: '1px solid rgba(148,163,184,0.08)',
    marginBottom: '18px',
  },
  pageTitle: { margin: 0, color: '#0f172a' },
  right: { display: 'flex', alignItems: 'center', gap: '12px' },
  info: { textAlign: 'right', marginRight: '8px' },
  name: { fontWeight: 800 },
  dept: { fontSize: '0.85rem', color: '#475569' },
  profile: { padding: '8px 10px', borderRadius: '8px', background: '#fff' },
  bell: { padding: '8px 10px', borderRadius: '8px' },
};

export default AdminTopbar;
