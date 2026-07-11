const About = () => {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <span style={styles.label}>About Nagrik360</span>
        <h1 style={styles.title}>Modern civic grievance management for a smarter India</h1>
        <p style={styles.text}>
          Nagrik360 brings citizen complaints, AI classification, and government workflows together in a single trusted portal.
          Our platform helps citizens submit issues, track progress, and get meaningful updates while governments act faster.
        </p>

        <div style={styles.grid}>
          <div style={styles.tile}>
            <h3 style={styles.tileTitle}>Mission</h3>
            <p style={styles.tileText}>Empower every citizen to raise civic issues easily and transparently.</p>
          </div>
          <div style={styles.tile}>
            <h3 style={styles.tileTitle}>Vision</h3>
            <p style={styles.tileText}>Build a responsive, AI-powered civic ecosystem for safer, smarter communities.</p>
          </div>
          <div style={styles.tile}>
            <h3 style={styles.tileTitle}>Objectives</h3>
            <p style={styles.tileText}>Streamline complaint resolution, improve department collaboration, and deliver real results.</p>
          </div>
          <div style={styles.tile}>
            <h3 style={styles.tileTitle}>Technology</h3>
            <p style={styles.tileText}>React, Node, Express, MongoDB, Cloudinary, Google Gemini, and modern UX design.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top left, rgba(59, 130, 246, 0.15), transparent 32%), #f8fbff',
    padding: '48px 20px 80px',
  },
  card: {
    maxWidth: '1080px',
    margin: '0 auto',
    background: 'rgba(255,255,255,0.96)',
    borderRadius: '28px',
    padding: '40px',
    boxShadow: '0 28px 85px rgba(15, 23, 42, 0.08)',
    border: '1px solid rgba(148, 163, 184, 0.22)',
  },
  label: {
    display: 'inline-flex',
    background: '#f0f9ff',
    color: '#0c4a6e',
    padding: '10px 18px',
    borderRadius: '999px',
    fontWeight: 700,
    marginBottom: '18px',
    fontSize: '0.85rem',
  },
  title: {
    fontSize: '2.8rem',
    color: '#0f172a',
    lineHeight: 1.05,
    margin: '0 0 20px',
  },
  text: {
    fontSize: '1rem',
    color: '#475569',
    lineHeight: 1.8,
    maxWidth: '760px',
    marginBottom: '36px',
  },
  grid: {
    display: 'grid',
    gap: '20px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  },
  tile: {
    padding: '26px',
    borderRadius: '24px',
    background: '#f8fafc',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    boxShadow: '0 16px 40px rgba(15, 23, 42, 0.05)',
  },
  tileTitle: {
    fontSize: '1.1rem',
    color: '#1e293b',
    marginBottom: '12px',
  },
  tileText: {
    fontSize: '0.95rem',
    color: '#475569',
    lineHeight: 1.7,
    margin: 0,
  },
};

export default About;
