import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

const AdminLayout = ({ children }) => {
  return (
    <div style={styles.app}>
      <AdminSidebar />
      <div style={styles.mainArea}>
        <AdminTopbar />
        <div style={styles.content}>{children}</div>
      </div>
    </div>
  );
};

const styles = {
  app: {
    display: 'flex',
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 60%)',
  },
  mainArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    padding: '28px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
};

export default AdminLayout;
