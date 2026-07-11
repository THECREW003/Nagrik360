import React, { useEffect, useState } from 'react';
import AdminLayout from '../../admin/AdminLayout';
import { complaintsAPI } from '../../services/api';

const DashboardCards = ({ counts }) => (
  <div style={cardStyles.row}>
    {[
      { label: 'Total Complaints', value: counts.total, color: '#1d4ed8' },
      { label: 'Pending', value: counts.pending, color: '#fb923c' },
      { label: 'In Progress', value: counts.in_progress, color: '#f59e0b' },
      { label: 'Resolved', value: counts.resolved, color: '#10b981' },
      { label: 'High Priority', value: counts.high, color: '#ef4444' },
    ].map((c) => (
      <div key={c.label} style={{ ...cardStyles.card, boxShadow: '0 12px 30px rgba(2,6,23,0.06)' }}>
        <div style={{ fontWeight: 800, color: c.color, fontSize: '1.05rem' }}>{c.label}</div>
        <div style={{ fontSize: '1.6rem', fontWeight: 900 }}>{c.value}</div>
      </div>
    ))}
  </div>
);

const RecentTable = ({ complaints, onView }) => (
  <div style={tableStyles.tableCard}>
    <h3 style={tableStyles.title}>Recent Complaints</h3>
    <table style={tableStyles.table}>
      <thead>
        <tr>
          <th>Complaint ID</th>
          <th>Citizen</th>
          <th>Category</th>
          <th>Department</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {complaints.map((c) => (
          <tr key={c._id} style={tableStyles.row}
              onMouseEnter={(e)=>{e.currentTarget.style.background='#f8fafc'; e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 8px 26px rgba(2,6,23,0.06)'}}
              onMouseLeave={(e)=>{e.currentTarget.style.background='transparent'; e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'}}>
            <td>{c.complaintId}</td>
            <td>{c.citizen?.name}</td>
            <td>{c.category}</td>
            <td>{c.department}</td>
            <td>{c.priority}</td>
            <td>{c.status}</td>
            <td>{new Date(c.createdAt).toLocaleDateString()}</td>
            <td><button style={tableStyles.viewBtn} onClick={() => onView(c._id)}>View</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [counts, setCounts] = useState({ total: 0, pending: 0, in_progress: 0, resolved: 0, high: 0 });

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const res = await complaintsAPI.getAll({ limit: 10 });
        if (mounted && res?.data?.complaints) {
          const mapped = res.data.complaints.map(mapComplaint);
          setComplaints(mapped);
          computeCounts(mapped);
          return;
        }
      } catch (err) {
        // on error, show empty state
      }
      if (mounted) {
        setComplaints([]);
        computeCounts([]);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  const mapComplaint = (c) => ({
    _id: c._id,
    complaintId: c.complaintId || c.complaintID || c.id,
    title: c.title,
    description: c.description,
    category: c.category,
    department: c.department?.name || c.department || (c.department && c.department.name) || 'Unassigned',
    priority: c.priority,
    status: c.status,
    createdAt: c.createdAt,
    citizen: c.user || c.citizen || null,
    media: c.media || [],
  });

  const computeCounts = (list) => {
    const total = list.length;
    const pending = list.filter((c) => c.status === 'pending').length;
    const in_progress = list.filter((c) => c.status === 'in_progress' || c.status === 'in progress').length;
    const resolved = list.filter((c) => c.status === 'resolved').length;
    const high = list.filter((c) => c.priority === 'high').length;
    setCounts({ total, pending, in_progress, resolved, high });
  };

  const handleView = (id) => {
    window.location.href = `/admin/complaints/${id}`;
  };

  return (
    <AdminLayout>
      <DashboardCards counts={counts} />
      <RecentTable complaints={complaints} onView={handleView} />
    </AdminLayout>
  );
};

const cardStyles = {
  row: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '18px', marginBottom: '20px' },
  card: { padding: '20px', borderRadius: '14px', background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(148,163,184,0.08)' },
};

const tableStyles = {
  tableCard: { padding: '18px', borderRadius: '14px', background: '#fff', border: '1px solid #e6edf6' },
  title: { margin: '0 0 12px', fontSize: '1.05rem' },
  table: { width: '100%', borderCollapse: 'collapse' },
  row: { borderBottom: '1px solid #eef2f6' },
  viewBtn: { padding: '6px 10px', borderRadius: '8px', background: '#1d4ed8', color: '#fff', border: 'none', cursor: 'pointer' },
};

export default AdminDashboard;
