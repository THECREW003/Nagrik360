import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Complaints from './pages/Complaints';
import CreateComplaint from './pages/CreateComplaint';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Rewards from './pages/Rewards';
import Analytics from './pages/Analytics';
import ComplaintDetail from './pages/ComplaintDetail';
import TrackComplaint from './pages/TrackComplaint';
import AIAssistant from './pages/AIAssistant';
import About from './pages/About';
import Contact from './pages/Contact';
import React, { lazy, Suspense, useEffect, useState } from 'react';
const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'));
const AdminComplaints = lazy(() => import('./admin/pages/AdminComplaints'));
const AdminComplaintDetail = lazy(() => import('./admin/pages/AdminComplaintDetail'));
const AdminAnalytics = lazy(() => import('./admin/pages/AdminAnalytics'));
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminDepartments = lazy(() => import('./admin/pages/AdminDepartments'));
const AdminNotifications = lazy(() => import('./admin/pages/AdminNotifications'));
const AdminSettings = lazy(() => import('./admin/pages/AdminSettings'));
const AdminOfficials = lazy(() => import('./admin/pages/AdminOfficials'));

const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
        <p>Checking authentication...</p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const RequireAdmin = ({ children }) => {
  const { loading } = useAuth();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('superAdminToken');
    const role = localStorage.getItem('role');
    setIsSuperAdmin(Boolean(token && role === 'super_admin'));
    setChecking(false);
  }, []);

  if (loading || checking) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
        <p>Checking admin access...</p>
      </div>
    );
  }

  return isSuperAdmin ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={styles.app}>
          <Navbar />
          <Suspense fallback={<div style={styles.loading}><div style={styles.spinner} /><p>Loading…</p></div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/complaints" element={<RequireAuth><Complaints /></RequireAuth>} />
            <Route path="/complaints/:id" element={<RequireAuth><ComplaintDetail /></RequireAuth>} />
            <Route path="/create-complaint" element={<RequireAuth><CreateComplaint /></RequireAuth>} />
            <Route path="/track-complaint" element={<TrackComplaint />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<RequireAdmin><AdminLayout><AdminDashboard /></AdminLayout></RequireAdmin>} />
            <Route path="/admin/complaints" element={<RequireAdmin><AdminLayout><AdminComplaints /></AdminLayout></RequireAdmin>} />
            <Route path="/admin/complaints/:id" element={<RequireAdmin><AdminLayout><AdminComplaintDetail /></AdminLayout></RequireAdmin>} />
            <Route path="/admin/analytics" element={<RequireAdmin><AdminLayout><AdminAnalytics /></AdminLayout></RequireAdmin>} />
            <Route path="/admin/departments" element={<RequireAdmin><AdminLayout><AdminDepartments /></AdminLayout></RequireAdmin>} />
            <Route path="/admin/officers" element={<RequireAdmin><AdminLayout><AdminOfficials /></AdminLayout></RequireAdmin>} />
            <Route path="/admin/notifications" element={<RequireAdmin><AdminLayout><AdminNotifications /></AdminLayout></RequireAdmin>} />
            <Route path="/admin/settings" element={<RequireAdmin><AdminLayout><AdminSettings /></AdminLayout></RequireAdmin>} />
            <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
            <Route path="/rewards" element={<RequireAuth><Rewards /></RequireAuth>} />
            <Route path="/admin" element={<RequireAdmin><AdminLayout><AdminDashboard /></AdminLayout></RequireAdmin>} />
            <Route path="/analytics" element={<RequireAdmin><AdminLayout><Analytics /></AdminLayout></RequireAdmin>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top, rgba(59, 130, 246, 0.08), transparent 35%), #eef2ff',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 120px)',
    color: '#334155',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #1e40af',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
};

export default App;
