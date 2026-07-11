import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile, changePassword, error, clearError } = useAuth();
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    if (error) clearError();
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    if (error) clearError();
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess(null);
    try {
      await updateProfile({
        name: profileForm.name,
        phone: profileForm.phone,
        address: {
          street: profileForm.street,
          city: profileForm.city,
          state: profileForm.state,
          pincode: profileForm.pincode,
        },
      });
      setProfileSuccess('Profile updated successfully!');
    } catch (err) {
      // error handled by context
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      clearError();
      setPasswordSuccess(null);
      // We'll use a local error state for this
      alert('New passwords do not match');
      return;
    }
    setPasswordLoading(true);
    setPasswordSuccess(null);
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordSuccess('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      // error handled by context
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.avatar}>
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div>
          <h1 style={styles.title}>{user?.name || 'User'}</h1>
          <p style={styles.role}>{user?.role?.replace('_', ' ') || 'Citizen'}</p>
          <p style={styles.email}>{user?.email}</p>
        </div>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.stat}>
          <span style={styles.statValue}>{user?.complaintsCount || 0}</span>
          <span style={styles.statLabel}>Complaints</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statValue}>{user?.resolvedCount || 0}</span>
          <span style={styles.statLabel}>Resolved</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statValue}>{user?.rewardPoints || 0}</span>
          <span style={styles.statLabel}>Points</span>
        </div>
      </div>

      <div style={styles.grid}>
        {/* Profile Form */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Edit Profile</h2>
          {profileSuccess && <div style={styles.success}>{profileSuccess}</div>}
          <form onSubmit={handleProfileSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone</label>
              <input
                type="tel"
                name="phone"
                value={profileForm.phone}
                onChange={handleProfileChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Street</label>
              <input
                type="text"
                name="street"
                value={profileForm.street}
                onChange={handleProfileChange}
                style={styles.input}
              />
            </div>
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>City</label>
                <input
                  type="text"
                  name="city"
                  value={profileForm.city}
                  onChange={handleProfileChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>State</label>
                <input
                  type="text"
                  name="state"
                  value={profileForm.state}
                  onChange={handleProfileChange}
                  style={styles.input}
                />
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Pincode</label>
              <input
                type="text"
                name="pincode"
                value={profileForm.pincode}
                onChange={handleProfileChange}
                style={styles.input}
              />
            </div>
            <button type="submit" disabled={profileLoading} style={styles.button}>
              {profileLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Password Form */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Change Password</h2>
          {passwordSuccess && <div style={styles.success}>{passwordSuccess}</div>}
          {error && <div style={styles.error}>{error}</div>}
          <form onSubmit={handlePasswordSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
                minLength={6}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
                minLength={6}
                style={styles.input}
              />
            </div>
            <button type="submit" disabled={passwordLoading} style={styles.button}>
              {passwordLoading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '30px',
    background: '#fff',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    border: '1px solid #e8eaf6',
  },
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #ff6f00 0%, #ff8f00 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.8rem',
    fontWeight: 700,
    color: '#fff',
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: 700,
    color: '#1a237e',
    margin: '0 0 4px 0',
  },
  role: {
    fontSize: '0.85rem',
    color: '#ff6f00',
    fontWeight: 600,
    textTransform: 'capitalize',
    margin: '0 0 2px 0',
  },
  email: {
    fontSize: '0.85rem',
    color: '#888',
    margin: 0,
  },
  statsRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '30px',
  },
  stat: {
    flex: 1,
    background: '#fff',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    border: '1px solid #e8eaf6',
  },
  statValue: {
    display: 'block',
    fontSize: '1.6rem',
    fontWeight: 800,
    color: '#1a237e',
  },
  statLabel: {
    fontSize: '0.8rem',
    color: '#888',
    fontWeight: 500,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '24px',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    border: '1px solid #e8eaf6',
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#1a237e',
    margin: '0 0 20px 0',
  },
  success: {
    background: '#e8f5e9',
    color: '#1b5e20',
    padding: '10px 14px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '0.9rem',
  },
  error: {
    background: '#ffebee',
    color: '#c62828',
    padding: '10px 14px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '0.9rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#555',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    fontSize: '0.9rem',
    outline: 'none',
  },
  row: {
    display: 'flex',
    gap: '12px',
  },
  button: {
    background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
    color: '#fff',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '8px',
  },
};

export default Profile;