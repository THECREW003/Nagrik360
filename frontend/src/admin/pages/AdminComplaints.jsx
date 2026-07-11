import React, { useEffect, useState } from 'react';
import AdminLayout from '../../admin/AdminLayout';
import { complaintsAPI } from '../../services/api';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await complaintsAPI.getAll({ page, limit, search });
        if (mounted && res?.data?.complaints) {
          const mapped = res.data.complaints.map((c) => ({
            _id: c._id,
            complaintId: c.complaintId,
            title: c.title,
            category: c.category,
            department: c.department?.name || c.department,
            priority: c.priority,
            status: c.status,
            createdAt: c.createdAt,
            citizen: c.user || c.citizen || null,
          }));
          setComplaints(mapped);
          setTotal(res.data.total || res.data.count || res.data.complaints.length);
          setLoading(false);
          return;
        }
      } catch (err) {
        // fallback to empty
      }
      if (mounted) {
        setComplaints([]);
        setTotal(0);
        setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, [page, limit, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <AdminLayout>
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={styles.title}>Complaint Management</h2>
          <div>
            <input placeholder="Search by ID, title, citizen" value={search} onChange={handleSearchChange} style={styles.search} />
          </div>
        </div>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
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
                <tr key={c._id}
                    onMouseEnter={(e)=>{e.currentTarget.style.background='#f8fafc'; e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(2,6,23,0.06)'}}
                    onMouseLeave={(e)=>{e.currentTarget.style.background='transparent'; e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'}}>
                  <td>{c.complaintId}</td>
                  <td>{c.citizen?.name}</td>
                  <td>{c.category}</td>
                  <td>{c.department}</td>
                  <td>{c.priority}</td>
                  <td>{c.status}</td>
                  <td>{new Date(c.createdAt).toLocaleString()}</td>
                  <td>
                    <a href={`/admin/complaints/${c._id}`} style={styles.view}>View</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <div style={{ color: '#64748b' }}>Page {page} of {totalPages}</div>
          <div>
            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} style={styles.pageBtn}>Prev</button>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} style={styles.pageBtn}>Next</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const styles = {
  card: { padding: '18px', borderRadius: '14px', background: '#fff', border: '1px solid #e6edf6' },
  title: { margin: 0, marginBottom: '12px' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  search: { padding: '8px 10px', borderRadius: '8px', border: '1px solid #e6edf6', minWidth: 260 },
  view: { padding: '6px 10px', borderRadius: '8px', background: '#1d4ed8', color: '#fff', textDecoration: 'none' },
  pageBtn: { padding: '8px 12px', borderRadius: '8px', border: 'none', background: '#1d4ed8', color: '#fff', marginLeft: 8, cursor: 'pointer' },
};

export default AdminComplaints;
