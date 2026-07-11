import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear token and redirect to admin login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>
        <div style={styles.icon}>🏛️</div>
        <div>
          <div style={styles.title}>Nagrik360</div>
          <div style={styles.subtitle}>Officials</div>
        </div>
      </div>

      <nav style={styles.nav}>
        <Link to="/admin/dashboard" style={styles.link} onMouseEnter={(e)=>{e.currentTarget.style.background='rgba(59,130,246,0.08)'; e.currentTarget.style.transform='translateX(6px)'}} onMouseLeave={(e)=>{e.currentTarget.style.background='transparent'; e.currentTarget.style.transform='none'}}>📊 Dashboard</Link>
        <Link to="/admin/complaints" style={styles.link} onMouseEnter={(e)=>{e.currentTarget.style.background='rgba(59,130,246,0.08)'; e.currentTarget.style.transform='translateX(6px)'}} onMouseLeave={(e)=>{e.currentTarget.style.background='transparent'; e.currentTarget.style.transform='none'}}>📝 Complaints</Link>
        <Link to="/admin/officers" style={styles.link} onMouseEnter={(e)=>{e.currentTarget.style.background='rgba(59,130,246,0.08)'; e.currentTarget.style.transform='translateX(6px)'}} onMouseLeave={(e)=>{e.currentTarget.style.background='transparent'; e.currentTarget.style.transform='none'}}>👮 Officials</Link>
        <Link to="/admin/departments" style={styles.link} onMouseEnter={(e)=>{e.currentTarget.style.background='rgba(59,130,246,0.08)'; e.currentTarget.style.transform='translateX(6px)'}} onMouseLeave={(e)=>{e.currentTarget.style.background='transparent'; e.currentTarget.style.transform='none'}}>🏢 Departments</Link>
        <Link to="/admin/analytics" style={styles.link} onMouseEnter={(e)=>{e.currentTarget.style.background='rgba(59,130,246,0.08)'; e.currentTarget.style.transform='translateX(6px)'}} onMouseLeave={(e)=>{e.currentTarget.style.background='transparent'; e.currentTarget.style.transform='none'}}>📈 Analytics</Link>
        <Link to="/admin/notifications" style={styles.link} onMouseEnter={(e)=>{e.currentTarget.style.background='rgba(59,130,246,0.08)'; e.currentTarget.style.transform='translateX(6px)'}} onMouseLeave={(e)=>{e.currentTarget.style.background='transparent'; e.currentTarget.style.transform='none'}}>🔔 Notifications</Link>
        <Link to="/admin/settings" style={styles.link} onMouseEnter={(e)=>{e.currentTarget.style.background='rgba(59,130,246,0.08)'; e.currentTarget.style.transform='translateX(6px)'}} onMouseLeave={(e)=>{e.currentTarget.style.background='transparent'; e.currentTarget.style.transform='none'}}>⚙️ Settings</Link>
      </nav>

      <div style={styles.footer}>
        <button style={styles.logout} onClick={handleLogout}>Logout</button>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '260px',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.7), rgba(248,250,252,0.7))',
    borderRight: '1px solid rgba(148,163,184,0.12)',
    padding: '22px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0 8px 30px rgba(2,6,23,0.06)',
    backdropFilter: 'blur(6px)',
  },
  brand: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '18px',
  },
  icon: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    background: '#fff',
    display: 'grid',
    placeItems: 'center',
    fontSize: '22px',
    boxShadow: '0 6px 20px rgba(2,6,23,0.06)'
  },
  title: { fontWeight: 800, color: '#0f172a' },
  subtitle: { fontSize: '0.85rem', color: '#475569' },
  nav: { display: 'grid', gap: '10px', marginTop: '12px' },
  link: {
    textDecoration: 'none',
    padding: '10px 12px',
    borderRadius: '10px',
    color: '#0f172a',
    fontWeight: 700,
    transition: 'all 0.18s ease',
  },
  footer: { marginTop: '20px' },
  logout: {
    width: '100%',
    padding: '10px 12px',
    background: '#fb923c',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: 700,
    cursor: 'pointer',
  },
};

export default AdminSidebar;
