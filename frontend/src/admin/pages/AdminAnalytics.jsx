import React, { useEffect, useState } from 'react';
import AdminLayout from '../../admin/AdminLayout';
import { analyticsAPI } from '../../services/api';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

const AdminAnalytics = () => {
  const [byDept, setByDept] = useState({});
  const [monthly, setMonthly] = useState([]);
  const [priorityDist, setPriorityDist] = useState({});
  const [resolutionRate, setResolutionRate] = useState(0);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const res = await analyticsAPI.getDashboard();
        if (!mounted) return;
        const analytics = res.data.analytics || res.data;

        // byDept
        const deptCounts = {};
        (analytics.categoryBreakdown || analytics.categoryBreakdown || []).forEach((c) => {
          deptCounts[c.category || c._id] = c.count || c.count;
        });

        // monthly
        const monthly = (analytics.monthlyTrend || analytics.monthlyTrend || []).map((m) => ({ month: m.month || `${m._id.year}-${String(m._id.month).padStart(2,'0')}`, count: m.count }));

        // priority
        const priority = analytics.priorityBreakdown || analytics.priorityBreakdown || analytics.priorityDistribution || {};

        setByDept(deptCounts);
        setMonthly(monthly);
        setPriorityDist(priority);
        setResolutionRate(analytics.overview?.resolutionRate || analytics.resolutionRate || 0);
        setRecent(analytics.recentComplaints || analytics.recent || []);
      } catch (err) {
        // fallback: keep zeros
        console.error('Analytics fetch failed, using empty data', err?.message || err);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  const barData = {
    labels: Object.keys(byDept),
    datasets: [{ label: 'Complaints', data: Object.values(byDept), backgroundColor: '#1d4ed8' }],
  };

  const lineData = {
    labels: monthly.map((m) => m.month),
    datasets: [{ label: 'Complaints', data: monthly.map((m) => m.count), borderColor: '#0ea5e9', backgroundColor: 'rgba(14,165,233,0.12)', tension: 0.3 }],
  };

  const doughnutData = {
    labels: Object.keys(priorityDist),
    datasets: [{ data: Object.values(priorityDist), backgroundColor: ['#ef4444', '#f59e0b', '#10b981'] }],
  };

  return (
    <AdminLayout>
      <div style={{ display: 'grid', gap: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <div style={styles.card}><h4>Complaints by Department</h4><Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} /></div>
          <div style={styles.card}><h4>Monthly Complaints</h4><Line data={lineData} options={{ responsive: true, plugins: { legend: { display: false } } }} /></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <div style={styles.card}>
            <h4>Resolution Rate</h4>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>{resolutionRate}%</div>
            <div style={{ height: 8, background: '#e6edf6', borderRadius: 8, marginTop: 8 }}><div style={{ width: `${resolutionRate}%`, height: '100%', background: '#10b981', borderRadius: 8 }} /></div>
          </div>
          <div style={styles.card}><h4>Priority Distribution</h4><Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} /></div>
        </div>

        <div style={styles.card}>
          <h4 style={{ marginTop: 0 }}>Recent complaints (from analytics)</h4>
          <ul>
            {recent.map((c) => (
              <li key={c._id}>{c.complaintId} — {c.title}</li>
            ))}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

const styles = {
  card: { padding: '18px', borderRadius: '12px', background: '#fff', border: '1px solid #e6edf6' },
};

export default AdminAnalytics;
