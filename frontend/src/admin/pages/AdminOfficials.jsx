import React, { useEffect, useState } from 'react';
import AdminLayout from '../../admin/AdminLayout';
import { officersAPI, departmentsAPI } from '../../services/api';

const tableStyles = {
  actionBtn: { marginRight: 8, padding: '6px 10px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer' },
  deleteBtn: { padding: '6px 10px', borderRadius: '8px', border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer' },
};

const AdminOfficials = () => {
  const [officers, setOfficers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', department: '' });
  const [editingOfficerId, setEditingOfficerId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', department: '' });

  useEffect(() => {
    fetch();
    departmentsAPI.getAll().then((r) => setDepartments(r.data.departments || r.data));
  }, [page]);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await officersAPI.list({ page, limit });
      setOfficers(res.data.officers || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      setOfficers([]);
      setTotal(0);
    }
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await officersAPI.create(form);
      setForm({ name: '', email: '', password: '', phone: '', department: '' });
      fetch();
      alert('Officer created');
    } catch (err) {
      alert('Error creating officer');
    }
  };

  const handleEditClick = (officer) => {
    setEditingOfficerId(officer._id);
    setEditForm({
      name: officer.name || '',
      email: officer.email || '',
      phone: officer.phone || '',
      department: officer.department?._id || '',
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingOfficerId) return;
    try {
      await officersAPI.update(editingOfficerId, editForm);
      setEditingOfficerId(null);
      setEditForm({ name: '', email: '', phone: '', department: '' });
      fetch();
      alert('Officer updated');
    } catch (err) {
      alert('Error updating officer');
    }
  };

  const handleCancelEdit = () => {
    setEditingOfficerId(null);
    setEditForm({ name: '', email: '', phone: '', department: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this officer?')) return;
    try {
      await officersAPI.delete(id);
      fetch();
      alert('Officer deleted');
    } catch (err) {
      alert('Error deleting officer');
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{ padding: 12 }}>
          <h2>Officials</h2>
          <form onSubmit={editingOfficerId ? handleUpdate : handleCreate} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <input placeholder="Name" value={editingOfficerId ? editForm.name : form.name} onChange={(e) => (editingOfficerId ? setEditForm({ ...editForm, name: e.target.value }) : setForm({ ...form, name: e.target.value }))} required />
            <input placeholder="Email" value={editingOfficerId ? editForm.email : form.email} onChange={(e) => (editingOfficerId ? setEditForm({ ...editForm, email: e.target.value }) : setForm({ ...form, email: e.target.value }))} required />
            {editingOfficerId ? null : <input placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />}
            <input placeholder="Phone" value={editingOfficerId ? editForm.phone : form.phone} onChange={(e) => (editingOfficerId ? setEditForm({ ...editForm, phone: e.target.value }) : setForm({ ...form, phone: e.target.value }))} />
            <select value={editingOfficerId ? editForm.department : form.department} onChange={(e) => (editingOfficerId ? setEditForm({ ...editForm, department: e.target.value }) : setForm({ ...form, department: e.target.value }))}>
              <option value="">Department</option>
              {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
            <button type="submit">{editingOfficerId ? 'Save Changes' : 'Create'}</button>
            {editingOfficerId && <button type="button" onClick={handleCancelEdit}>Cancel</button>}
          </form>
        </div>

        <div style={{ padding: 12 }}>
          <h3>Officials List</h3>
          {loading ? <div>Loading…</div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {officers.map(o => (
                  <tr key={o._id}>
                    <td>{o.name}</td>
                    <td>{o.email}</td>
                    <td>{o.department?.name}</td>
                    <td>{o.phone}</td>
                    <td>
                      <button style={tableStyles.actionBtn} onClick={() => handleEditClick(o)}>Edit</button>
                      <button style={tableStyles.deleteBtn} onClick={() => handleDelete(o._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div style={{ marginTop: 8 }}>
            <button disabled={page<=1} onClick={() => setPage(p=>p-1)}>Prev</button>
            <span style={{ margin: '0 8px' }}>Page {page}</span>
            <button disabled={page*limit >= total} onClick={() => setPage(p=>p+1)}>Next</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOfficials;
