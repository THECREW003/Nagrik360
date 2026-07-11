import { useState, useEffect } from 'react';
import { complaintsAPI } from '../services/api';
import ComplaintCard from '../components/ComplaintCard';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: '',
    search: '',
    page: 1,
    limit: 12,
  });
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { ...filters };
      // Remove empty filters
      Object.keys(params).forEach((key) => {
        if (!params[key]) delete params[key];
      });
      const response = await complaintsAPI.getAll(params);
      setComplaints(response.data.complaints);
      setPagination({
        total: response.data.total,
        totalPages: response.data.totalPages,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [filters.page, filters.status, filters.category, filters.priority, filters.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Complaints</h1>
        <span style={styles.count}>{pagination.total} total</span>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search complaints..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchBtn}>Search</button>
        </form>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
          style={styles.select}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
          <option value="closed">Closed</option>
        </select>
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
          style={styles.select}
        >
          <option value="">All Categories</option>
          <option value="Roads & Infrastructure">Roads & Infrastructure</option>
          <option value="Water Supply">Water Supply</option>
          <option value="Electricity">Electricity</option>
          <option value="Sanitation">Sanitation</option>
          <option value="Public Safety">Public Safety</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Education">Education</option>
          <option value="Environment">Environment</option>
          <option value="Other">Other</option>
        </select>
        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value, page: 1 })}
          style={styles.select}
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Loading complaints...</p>
        </div>
      ) : (
        <>
          {complaints.length === 0 ? (
            <div style={styles.empty}>
              <p>No complaints found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {complaints.map((complaint) => (
                <ComplaintCard key={complaint._id} complaint={complaint} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                disabled={filters.page <= 1}
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                style={styles.pageBtn}
              >
                Previous
              </button>
              <span style={styles.pageInfo}>
                Page {filters.page} of {pagination.totalPages}
              </span>
              <button
                disabled={filters.page >= pagination.totalPages}
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                style={styles.pageBtn}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 700,
    color: '#1a237e',
    margin: 0,
  },
  count: {
    color: '#888',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  filters: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  searchForm: {
    display: 'flex',
    gap: '8px',
    flex: '1',
    minWidth: '250px',
  },
  searchInput: {
    flex: '1',
    padding: '10px 16px',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    fontSize: '0.9rem',
    outline: 'none',
  },
  searchBtn: {
    background: '#1a237e',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  select: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    fontSize: '0.9rem',
    outline: 'none',
    background: '#fff',
    minWidth: '150px',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    color: '#666',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e8eaf6',
    borderTop: '4px solid #1a237e',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  error: {
    background: '#ffebee',
    color: '#c62828',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    background: '#fff',
    borderRadius: '12px',
    border: '2px dashed #e0e0e0',
    color: '#888',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '16px',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '30px',
  },
  pageBtn: {
    background: '#fff',
    color: '#1a237e',
    border: '2px solid #1a237e',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  pageInfo: {
    color: '#666',
    fontSize: '0.9rem',
  },
};

export default Complaints;