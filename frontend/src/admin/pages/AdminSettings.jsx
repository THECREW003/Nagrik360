import React from 'react';
import AdminLayout from '../../admin/AdminLayout';

const AdminSettings = () => (
  <AdminLayout>
    <div style={styles.card}>
      <h2 style={styles.title}>Settings</h2>
      <div style={styles.row}>
        <label style={styles.label}>Notification email</label>
        <input style={styles.input} defaultValue="admin@government.gov.in" />
      </div>
      <div style={styles.row}>
        <label style={styles.label}>Auto assign department</label>
        <select style={styles.input}>
          <option>Enable</option>
          <option>Disable</option>
        </select>
      </div>
      <div style={{ marginTop: 12 }}>
        <button style={styles.save}>Save settings</button>
      </div>
    </div>
  </AdminLayout>
);

const styles = {
  card: { padding: '18px', borderRadius: '12px', background: '#fff', border: '1px solid #e6edf6' },
  title: { margin: 0, marginBottom: '12px' },
  row: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' },
  label: { minWidth: '180px', color: '#334155' },
  input: { padding: '10px', borderRadius: '8px', border: '1px solid #e6edf6' },
  save: { padding: '10px 12px', borderRadius: '8px', background: '#1d4ed8', color: '#fff', border: 'none' },
};

export default AdminSettings;
