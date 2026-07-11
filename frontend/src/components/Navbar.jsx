import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationsAPI } from '../services/api';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isOfficial, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    const fetchUnread = async () => {
      if (!isAuthenticated) {
        setUnreadCount(0);
        return;
      }
      try {
        const response = await notificationsAPI.getUnreadCount();
        if (mounted) setUnreadCount(response.data.unreadCount || 0);
      } catch (err) {
        console.error('Unable to fetch unread notifications', err);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 60000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin';
    if (isOfficial) return '/dashboard';
    return '/dashboard';
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <div style={styles.brand}>
          <Link to="/" style={styles.logo}>
            <span style={styles.logoIcon}>🏛️</span>
            <span style={styles.logoText}>Nagrik360</span>
          </Link>
        </div>

        {/* Hamburger for mobile */}
        <button style={{ ...styles.hamburger, display: isMobile ? 'flex' : 'none' }} onClick={() => setIsOpen(!isOpen)}>
          <span style={{ ...styles.hamburgerLine, transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ ...styles.hamburgerLine, opacity: isOpen ? 0 : 1 }} />
          <span style={{ ...styles.hamburgerLine, transform: isOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>

        <div style={{ ...styles.navLinks, display: !isMobile || isOpen ? 'flex' : 'none' }}>
          <Link to="/track-complaint" style={styles.link} onClick={() => setIsOpen(false)}>
            Track Complaint
          </Link>
          <Link to="/ai-assistant" style={styles.link} onClick={() => setIsOpen(false)}>
            AI Assistant
          </Link>
          <Link to="/about" style={styles.link} onClick={() => setIsOpen(false)}>
            About
          </Link>
          <Link to="/contact" style={styles.link} onClick={() => setIsOpen(false)}>
            Contact
          </Link>
          {!isAuthenticated && (
            <Link to="/admin/login" style={styles.adminBtn} onClick={() => setIsOpen(false)}>
              Admin Login
            </Link>
          )}
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" style={styles.link} onClick={() => setIsOpen(false)}>
                Dashboard
              </Link>
              <Link to="/complaints" style={styles.link} onClick={() => setIsOpen(false)}>
                Complaints
              </Link>
              <Link to="/create-complaint" style={styles.link} onClick={() => setIsOpen(false)}>
                New Complaint
              </Link>
              <Link to="/notifications" style={styles.link} onClick={() => setIsOpen(false)}>
                Notifications
                {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
              </Link>
              <Link to="/rewards" style={styles.link} onClick={() => setIsOpen(false)}>
                Rewards
              </Link>
              {isAdmin && (
                <Link to="/admin" style={styles.link} onClick={() => setIsOpen(false)}>
                  Admin Analytics
                </Link>
              )}
              <Link to="/profile" style={styles.userSection} onClick={() => setIsOpen(false)}>
                <div style={styles.avatar}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div style={styles.userInfo}>
                  <span style={styles.userName}>{user?.name || 'User'}</span>
                  <span style={styles.userRole}>{user?.role?.replace('_', ' ') || ''}</span>
                </div>
              </Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link} onClick={() => setIsOpen(false)}>
                Login
              </Link>
              <Link to="/register" style={styles.registerBtn} onClick={() => setIsOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
    padding: '0 20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '64px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    color: '#fff',
    fontWeight: 700,
    fontSize: '1.3rem',
  },
  logoIcon: {
    fontSize: '1.5rem',
  },
  logoText: {
    letterSpacing: '0.5px',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  badge: {
    display: 'inline-flex',
    marginLeft: '8px',
    background: '#ef4444',
    color: '#fff',
    borderRadius: '999px',
    padding: '2px 8px',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  link: {
    color: 'rgba(255,255,255,0.9)',
    textDecoration: 'none',
    padding: '8px 14px',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    color: '#fff',
    padding: '4px 10px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.1)',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#ff6f00',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '0.9rem',
    color: '#fff',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.2,
  },
  userName: {
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  userRole: {
    fontSize: '0.65rem',
    opacity: 0.7,
    textTransform: 'capitalize',
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.3)',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  adminBtn: {
    background: '#7c3aed',
    color: '#fff',
    textDecoration: 'none',
    padding: '8px 18px',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  registerBtn: {
    background: '#ff6f00',
    color: '#fff',
    textDecoration: 'none',
    padding: '8px 18px',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  hamburger: {
    display: 'none',
    flexDirection: 'column',
    gap: '4px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
  },
  hamburgerLine: {
    width: '24px',
    height: '2px',
    background: '#fff',
    borderRadius: '2px',
    transition: 'all 0.3s',
  },
};

export default Navbar;