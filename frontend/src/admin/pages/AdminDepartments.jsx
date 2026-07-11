import React from 'react';
import AdminLayout from '../../admin/AdminLayout';

const departments = [
  { id: 1, name: 'Public Works', head: 'S. K. Verma', contact: 'pw@example.gov.in' },
  { id: 2, name: 'Electricity', head: 'R. Gupta', contact: 'elec@example.gov.in' },
  { id: 3, name: 'Sanitation', head: 'M. Sharma', contact: 'san@example.gov.in' },
];

const AdminDepartments = () => {
  return (
    <AdminLayout>
      <div style={styles.card}>
        <h2 style={styles.title}>Departments</h2>
        <div style={styles.grid}>
          {departments.map((d) => (
            <div key={d.id} style={styles.tile}>
              <div style={styles.icon}>🏢</div>
              <div>
                <div style={styles.name}>{d.name}</div>
                <div style={styles.meta}>{d.head} • {d.contact}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

const styles = {
  card: { padding: '18px', borderRadius: '12px', background: '#fff', border: '1px solid #e6edf6' },
  title: { margin: 0, marginBottom: '12px' },
  grid: { display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' },
  tile: { display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', borderRadius: '10px', background: '#f8fafc', transition: 'transform 0.15s', cursor: 'pointer' },
  icon: { width: 44, height: 44, borderRadius: 10, background: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 8px 18px rgba(2,6,23,0.04)' },
  name: { fontWeight: 800 },
  meta: { color: '#64748b', fontSize: '0.9rem' },
};

export default AdminDepartments;
