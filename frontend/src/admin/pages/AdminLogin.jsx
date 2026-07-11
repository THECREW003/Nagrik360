import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { superAdminAPI } from '../../services/api';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const resp = await superAdminAPI.login(form);
      localStorage.setItem('superAdminToken', resp.data.token);
      localStorage.setItem('superAdmin_user', JSON.stringify(resp.data.user));
      localStorage.setItem('role', 'super_admin');
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Super Admin Login</h2>
        <p style={styles.subtitle}>Sign in with Super Admin credentials to manage the platform.</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" style={styles.input} required />
          <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" style={styles.input} required />
          <button type="submit" disabled={loading} style={styles.button}>{loading ? 'Signing in…' : 'Sign in'}</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'linear-gradient(180deg,#eef2ff 0%,#fff 60%)' },
  card: { width: '460px', padding: '28px', borderRadius: '18px', background: 'rgba(255,255,255,0.9)', boxShadow: '0 20px 60px rgba(2,6,23,0.06)' },
  title: { margin: 0, fontSize: '1.4rem', color: '#0f172a' },
  subtitle: { marginTop: '8px', color: '#475569' },
  form: { display: 'grid', gap: '12px', marginTop: '18px' },
  input: { padding: '12px 14px', borderRadius: '10px', border: '1px solid #e6edf6' },
  button: { padding: '12px', borderRadius: '10px', background: '#1d4ed8', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' },
  error: { background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '8px' },
};

export default AdminLogin;
