import React, { useEffect, useState } from 'react';
import AdminLayout from '../../admin/AdminLayout';
import { complaintsAPI, officersAPI } from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const AdminComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remark, setRemark] = useState('');
  const [officers, setOfficers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const [complaintRes, officersRes] = await Promise.all([
          complaintsAPI.getById(id),
          officersAPI.list({ page: 1, limit: 100 }),
        ]);

        if (mounted) {
          const c = complaintRes?.data?.complaint;
          if (c) {
            const mapped = {
              ...c,
              citizen: c.user || c.citizen || null,
              department: c.department?.name || c.department,
              departmentId: c.department?._id || (typeof c.department === 'string' ? c.department : null),
              assignedTo: c.assignedTo || null,
              media: c.media || [],
            };
            setComplaint(mapped);
            setSelectedOfficer(c.assignedTo?._id || c.assignedTo || '');
          }
          setOfficers(officersRes?.data?.officers || officersRes?.data || []);
          setLoading(false);
          return;
        }
      } catch (err) {
        // show blank state on failure
      }
      if (mounted) {
        setComplaint(null);
        setOfficers([]);
        setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, [id]);

  const changeStatus = async (newStatus) => {
    try {
      await complaintsAPI.updateStatus(complaint._id, { status: newStatus });
      setComplaint((c) => ({ ...c, status: newStatus }));
    } catch (err) {
      // ignore for mock
      setComplaint((c) => ({ ...c, status: newStatus }));
    }
  };

  const assignOfficer = async () => {
    if (!selectedOfficer) return;
    setAssigning(true);
    try {
      const res = await complaintsAPI.assign(complaint._id, { departmentId: complaint.departmentId, assignedTo: selectedOfficer });
      const updated = res.data.complaint;
      setComplaint((c) => ({ ...c, assignedTo: updated.assignedTo || selectedOfficer }));
      alert('Officer assigned');
    } catch (err) {
      alert('Failed to assign officer');
    } finally {
      setAssigning(false);
    }
  };

  const addRemark = () => {
    if (!remark) return;
    setComplaint((c) => ({ ...c, timeline: [...(c.timeline||[]), { remark, updatedAt: new Date().toISOString() }] }));
    setRemark('');
  };

  if (loading) return <div style={{ padding: 40 }}>Loading…</div>;

  return (
    <AdminLayout>
      <div style={styles.container}>
        <div style={styles.left}>
          <div style={styles.card}>
            <h3>{complaint.title}</h3>
            <p style={styles.meta}>ID: {complaint.complaintId} • {complaint.category} • {complaint.priority}</p>
            <div style={styles.mediaArea}>
              {complaint.media?.length ? (
                <img src={complaint.media[0].url || complaint.media[0]} alt="evidence" style={styles.media} />
              ) : (
                <div style={styles.mediaPlaceholder}>No image</div>
              )}
            </div>
            <p style={styles.desc}>{complaint.description}</p>
            <div style={styles.infoRow}>
              <div><strong>Assigned Dept:</strong> {complaint.department || 'Unassigned'}</div>
              <div><strong>Location:</strong> {complaint.location?.address || JSON.stringify(complaint.location?.coordinates)}</div>
            </div>
            <div style={{ marginTop: 12 }}>
              <button style={styles.primary} onClick={() => changeStatus('in_progress')}>Mark In Progress</button>
              <button style={styles.primaryAlt} onClick={() => changeStatus('resolved')}>Mark Resolved</button>
            </div>
            <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
              <label style={{ fontWeight: 700 }}>Assign Officer</label>
              <select value={selectedOfficer} onChange={(e) => setSelectedOfficer(e.target.value)} style={styles.select}>
                <option value="">Choose officer</option>
                {officers.map((o) => (
                  <option key={o._id} value={o._id}>{o.name} ({o.email})</option>
                ))}
              </select>
              <button style={styles.secondary} onClick={assignOfficer} disabled={!selectedOfficer || assigning}>{assigning ? 'Assigning…' : 'Assign Officer'}</button>
            </div>
          </div>
        </div>

        <div style={styles.right}>
          <div style={styles.cardLight}>
            <h4>AI Classification</h4>
            <p>Category: {complaint.aiClassification?.category || 'N/A'}</p>
            <p>Priority: {complaint.aiClassification?.priority || 'N/A'}</p>
            <p>Severity: {complaint.aiClassification?.severity || 'N/A'}</p>
          </div>

          <div style={styles.cardLight}>
            <h4>Citizen</h4>
            <p>{complaint.citizen?.name}</p>
            <p>{complaint.citizen?.phone}</p>
          </div>
          <div style={styles.cardLight}>
            <h4>Assigned Officer</h4>
            <p>{complaint.assignedTo?.name || complaint.assignedTo || 'Unassigned'}</p>
          </div>

          <div style={styles.cardLight}>
            <h4>Timeline</h4>
            <div style={styles.timeline}>
              {(complaint.timeline||[]).map((t, i) => (
                <div key={i} style={styles.timelineItem}>
                  <div style={styles.time}>{new Date(t.updatedAt).toLocaleString()}</div>
                  <div style={styles.remark}>{t.remark}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12 }}>
              <textarea value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Add remark" style={styles.textarea} />
              <button onClick={addRemark} style={styles.addRemark}>Add Remark</button>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

const styles = {
  container: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '18px' },
  left: {},
  right: {},
  card: { padding: '18px', borderRadius: '12px', background: '#fff', border: '1px solid #e6edf6' },
  cardLight: { padding: '14px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e6edf6', marginBottom: '12px' },
  mediaArea: { marginTop: 12, marginBottom: 12 },
  media: { width: '100%', borderRadius: '10px' },
  mediaPlaceholder: { width: '100%', height: '180px', display: 'grid', placeItems: 'center', background: '#eef2f6', borderRadius: '10px' },
  desc: { color: '#334155' },
  infoRow: { display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '12px' },
  primary: { padding: '8px 12px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', marginRight: '8px', cursor: 'pointer' },
  primaryAlt: { padding: '8px 12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', marginRight: '8px', cursor: 'pointer' },
  secondary: { padding: '8px 12px', background: '#e2e8f0', color: '#0f172a', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  timeline: { maxHeight: '240px', overflowY: 'auto' },
  timelineItem: { padding: '8px 0', borderBottom: '1px solid #eef2f6' },
  time: { fontSize: '0.85rem', color: '#64748b' },
  remark: { marginTop: '6px' },
  textarea: { width: '100%', minHeight: '60px', padding: '8px', borderRadius: '8px', border: '1px solid #e6edf6' },
  addRemark: { marginTop: '8px', padding: '8px 12px', borderRadius: '8px', background: '#1d4ed8', color: '#fff', border: 'none' },
  select: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' },
};

export default AdminComplaintDetail;
