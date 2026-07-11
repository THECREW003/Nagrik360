import { useState, useEffect } from 'react';
import { rewardsAPI } from '../services/api';

const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRewards = async () => {
      try {
        const [rewardsRes, leaderboardRes] = await Promise.all([
          rewardsAPI.getAll({ limit: 20 }),
          rewardsAPI.getLeaderboard(),
        ]);
        setRewards(rewardsRes.data.rewards);
        setLeaderboard(leaderboardRes.data.leaderboard);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load rewards');
      } finally {
        setLoading(false);
      }
    };
    loadRewards();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Rewards</h1>
          <p style={styles.subtitle}>Track your reward points and the top contributors in Nagrik360.</p>
        </div>
      </div>

      {loading ? (
        <div style={styles.loading}>
          <div style={styles.spinner} />
          <p>Loading rewards...</p>
        </div>
      ) : error ? (
        <div style={styles.error}>{error}</div>
      ) : (
        <div style={styles.grid}>
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Your Rewards</h2>
            {rewards.length === 0 ? (
              <div style={styles.empty}>No rewards earned yet.</div>
            ) : (
              <div style={styles.itemList}>
                {rewards.map((reward) => (
                  <div key={reward._id} style={styles.rewardItem}>
                    <div>
                      <h3 style={styles.rewardTitle}>{reward.title}</h3>
                      <p style={styles.rewardDescription}>{reward.description}</p>
                      <span style={styles.rewardDate}>
                        {new Date(reward.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <span style={styles.rewardPoints}>+{reward.points}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Leaderboard</h2>
            {leaderboard.length === 0 ? (
              <div style={styles.empty}>No leaderboard data available.</div>
            ) : (
              <div style={styles.itemList}>
                {leaderboard.map((user, index) => (
                  <div key={user._id} style={styles.leaderboardItem}>
                    <span style={styles.rank}>#{index + 1}</span>
                    <div>
                      <h3 style={styles.rewardTitle}>{user.name}</h3>
                      <p style={styles.rewardDescription}>{user.complaintsCount} complaints</p>
                    </div>
                    <span style={styles.rewardPoints}>{user.rewardPoints}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  header: {
    marginBottom: '24px',
  },
  title: {
    fontSize: '1.9rem',
    fontWeight: 700,
    color: '#1a237e',
    margin: 0,
  },
  subtitle: {
    color: '#52606d',
    marginTop: '8px',
    fontSize: '0.95rem',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '220px',
    color: '#64748b',
  },
  spinner: {
    width: '36px',
    height: '36px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #1a237e',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  error: {
    padding: '18px',
    background: '#ffebee',
    borderRadius: '14px',
    color: '#c62828',
    border: '1px solid #ef9a9a',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '20px',
  },
  card: {
    background: '#fff',
    padding: '22px',
    borderRadius: '18px',
    border: '1px solid #e8eaf6',
    boxShadow: '0 6px 22px rgba(15, 23, 42, 0.05)',
  },
  sectionTitle: {
    margin: '0 0 18px 0',
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#1a237e',
  },
  itemList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  rewardItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'flex-start',
    padding: '18px',
    borderRadius: '16px',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
  },
  leaderboardItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'center',
    padding: '18px',
    borderRadius: '16px',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
  },
  rank: {
    fontWeight: 700,
    color: '#1a237e',
    minWidth: '40px',
  },
  rewardTitle: {
    margin: '0 0 4px 0',
    fontSize: '1rem',
    color: '#102a43',
  },
  rewardDescription: {
    margin: 0,
    color: '#52606d',
    fontSize: '0.9rem',
  },
  rewardDate: {
    fontSize: '0.8rem',
    color: '#64748b',
  },
  rewardPoints: {
    fontWeight: 700,
    color: '#1a237e',
    minWidth: '60px',
    textAlign: 'right',
  },
  empty: {
    padding: '26px',
    background: '#f4f6f8',
    borderRadius: '14px',
    textAlign: 'center',
    color: '#64748b',
  },
};

export default Rewards;
