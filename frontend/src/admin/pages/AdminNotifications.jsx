import React from 'react';
import AdminLayout from '../../admin/AdminLayout';

const sample = [
  { id: 1, text: 'Complaint NGR-0002 assigned to Electricity', time: '2 hours ago' },
  { id: 2, text: 'New complaint NGR-0003 pending review', time: '1 day ago' },
];

const AdminNotifications = () => (
  <AdminLayout>
    <div style={styles.card}>
      <h2 style={styles.title}>Notifications</h2>
      <ul style={styles.list}>
        {sample.map((n) => (
          <li key={n.id} style={styles.item}>
            <div style={styles.text}>{n.text}</div>
            <div style={styles.time}>{n.time}</div>
          </li>
        ))}
      </ul>
    </div>
  </AdminLayout>
);

const styles = {
  card: { padding: '18px', borderRadius: '12px', background: '#fff', border: '1px solid #e6edf6' },
  title: { margin: 0, marginBottom: '12px' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  item: { padding: '12px', borderRadius: '10px', background: '#f8fafc', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' },
  text: { color: '#0f172a' },
  time: { color: '#64748b', fontSize: '0.85rem' },
};

export default AdminNotifications;
