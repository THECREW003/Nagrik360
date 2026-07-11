import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Your Voice Matters in <span style={styles.highlight}>Nagrik360</span>
          </h1>
          <p style={styles.heroSubtitle}>
            India's smart civic complaint management platform. Report issues, track progress,
            and help build a better community with AI-powered classification and real-time tracking.
          </p>
          <div style={styles.heroButtons}>
            {isAuthenticated ? (
              <>
                <Link to="/create-complaint" style={styles.primaryBtn}>
                  File a Complaint
                </Link>
                <Link to="/track-complaint" style={styles.secondaryBtn}>
                  Track Complaint
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" style={styles.primaryBtn}>
                  Get Started
                </Link>
                <Link to="/login" style={styles.secondaryBtn}>
                  Sign In
                </Link>
                <Link to="/ai-assistant" style={styles.secondaryBtn}>
                  AI Assistant
                </Link>
              </>
            )}
          </div>
        </div>
        <div style={styles.heroImage}>
          <div style={styles.illustration}>
            <span style={styles.illustrationIcon}>🏛️</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>How Nagrik360 Works</h2>
        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <span style={styles.featureIcon}>📝</span>
            <h3 style={styles.featureTitle}>Report Issues</h3>
            <p style={styles.featureDesc}>
              Submit complaints with photos, audio, or video. Our AI automatically categorizes
              and prioritizes your issue.
            </p>
          </div>
          <div style={styles.featureCard}>
            <span style={styles.featureIcon}>🤖</span>
            <h3 style={styles.featureTitle}>AI Classification</h3>
            <p style={styles.featureDesc}>
              Powered by Google Gemini AI, complaints are analyzed for safety, severity, and
              urgency, then routed to the right department.
            </p>
          </div>
          <div style={styles.featureCard}>
            <span style={styles.featureIcon}>📊</span>
            <h3 style={styles.featureTitle}>Track Progress</h3>
            <p style={styles.featureDesc}>
              Real-time tracking of your complaints with status updates, timeline, and
              notifications at every step.
            </p>
          </div>
          <div style={styles.featureCard}>
            <span style={styles.featureIcon}>🏆</span>
            <h3 style={styles.featureTitle}>Earn Rewards</h3>
            <p style={styles.featureDesc}>
              Earn points for submitting complaints, giving feedback, and helping your
              community. Climb the leaderboard!
            </p>
          </div>
          <div style={styles.featureCard}>
            <span style={styles.featureIcon}>🗺️</span>
            <h3 style={styles.featureTitle}>Nearby Issues</h3>
            <p style={styles.featureDesc}>
              See complaints near your location. Upvote issues that matter to you and
              help prioritize community concerns.
            </p>
          </div>
          <div style={styles.featureCard}>
            <span style={styles.featureIcon}>🔔</span>
            <h3 style={styles.featureTitle}>Instant Notifications</h3>
            <p style={styles.featureDesc}>
              Get notified when your complaint status changes, when officials respond,
              or when similar issues are reported nearby.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.stats}>
        <div style={styles.statItem}>
          <span style={styles.statNumber}>10,000+</span>
          <span style={styles.statLabel}>Complaints Filed</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statNumber}>95%</span>
          <span style={styles.statLabel}>Resolution Rate</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statNumber}>50+</span>
          <span style={styles.statLabel}>Departments</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statNumber}>100K+</span>
          <span style={styles.statLabel}>Active Citizens</span>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © 2026 Nagrik360 — Smart Civic Complaint Management System
        </p>
      </footer>
    </div>
  );
};

const styles = {
  hero: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '80px 20px',
    gap: '40px',
    flexWrap: 'wrap',
  },
  heroContent: {
    flex: '1',
    minWidth: '300px',
  },
  heroTitle: {
    fontSize: '2.8rem',
    fontWeight: 800,
    color: '#1a237e',
    lineHeight: 1.2,
    margin: '0 0 20px 0',
  },
  highlight: {
    color: '#ff6f00',
  },
  heroSubtitle: {
    fontSize: '1.1rem',
    color: '#555',
    lineHeight: 1.6,
    margin: '0 0 30px 0',
    maxWidth: '600px',
  },
  heroButtons: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    background: 'linear-gradient(135deg, #ff6f00 0%, #ff8f00 100%)',
    color: '#fff',
    padding: '14px 32px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    display: 'inline-block',
  },
  secondaryBtn: {
    background: '#fff',
    color: '#1a237e',
    padding: '14px 32px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    display: 'inline-block',
    border: '2px solid #1a237e',
  },
  heroImage: {
    flex: '1',
    minWidth: '280px',
    display: 'flex',
    justifyContent: 'center',
  },
  illustration: {
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationIcon: {
    fontSize: '6rem',
  },
  features: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '60px 20px',
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1a237e',
    marginBottom: '40px',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
  },
  featureCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    transition: 'transform 0.2s',
    border: '1px solid #e8eaf6',
  },
  featureIcon: {
    fontSize: '2.5rem',
    display: 'block',
    marginBottom: '16px',
  },
  featureTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#1a237e',
    margin: '0 0 10px 0',
  },
  featureDesc: {
    fontSize: '0.95rem',
    color: '#666',
    lineHeight: 1.5,
    margin: 0,
  },
  stats: {
    background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
    padding: '60px 20px',
    display: 'flex',
    justifyContent: 'center',
    gap: '60px',
    flexWrap: 'wrap',
  },
  statItem: {
    textAlign: 'center',
    color: '#fff',
  },
  statNumber: {
    display: 'block',
    fontSize: '2.5rem',
    fontWeight: 800,
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '1rem',
    opacity: 0.8,
  },
  footer: {
    textAlign: 'center',
    padding: '30px 20px',
    background: '#f5f5f5',
  },
  footerText: {
    color: '#666',
    fontSize: '0.9rem',
    margin: 0,
  },
};

export default Home;