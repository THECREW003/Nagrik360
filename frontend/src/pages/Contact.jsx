const Contact = () => {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.label}>Contact</span>
          <h1 style={styles.title}>Get in touch with Nagrik360 support</h1>
          <p style={styles.subtitle}>
            For assistance with filing complaints, tracking progress, or reporting platform issues,
            connect with our support team.
          </p>
        </div>

        <div style={styles.grid}>
          <div style={styles.infoCard}>
            <h2 style={styles.sectionTitle}>Government Office</h2>
            <p style={styles.text}>Nagrik360 Civic Services</p>
            <p style={styles.text}>Smart City Operations Centre</p>
            <p style={styles.text}>New Delhi, India</p>
          </div>

          <div style={styles.infoCard}>
            <h2 style={styles.sectionTitle}>Contact Details</h2>
            <p style={styles.text}>Email: support@nagrik360.gov.in</p>
            <p style={styles.text}>Phone: +91 11 2345 6789</p>
            <p style={styles.text}>Office Hours: Mon–Fri, 9:00 AM – 6:00 PM</p>
          </div>

          <div style={styles.infoCard}>
            <h2 style={styles.sectionTitle}>Quick Form</h2>
            <form style={styles.form}>
              <input type="text" placeholder="Your name" style={styles.input} />
              <input type="email" placeholder="Email address" style={styles.input} />
              <textarea placeholder="Your message" rows="5" style={styles.textarea} />
              <button type="button" style={styles.button}>Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    padding: '48px 20px 80px',
    background: 'radial-gradient(circle at top right, rgba(37, 99, 235, 0.14), transparent 35%), #f8fbff',
  },
  card: {
    maxWidth: '1080px',
    margin: '0 auto',
    background: 'rgba(255,255,255,0.98)',
    borderRadius: '28px',
    padding: '40px',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    boxShadow: '0 28px 70px rgba(15, 23, 42, 0.08)',
  },
  header: {
    marginBottom: '32px',
  },
  label: {
    display: 'inline-flex',
    background: '#e0f2fe',
    color: '#0369a1',
    padding: '10px 18px',
    borderRadius: '999px',
    fontWeight: 700,
    fontSize: '0.85rem',
    marginBottom: '18px',
  },
  title: {
    fontSize: '2.8rem',
    color: '#102a43',
    margin: 0,
  },
  subtitle: {
    color: '#475569',
    fontSize: '1rem',
    lineHeight: 1.8,
    marginTop: '16px',
    maxWidth: '680px',
  },
  grid: {
    display: 'grid',
    gap: '24px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  },
  infoCard: {
    borderRadius: '24px',
    background: '#f8fafc',
    padding: '28px',
    border: '1px solid rgba(148, 163, 184, 0.18)',
    boxShadow: '0 16px 40px rgba(15, 23, 42, 0.05)',
  },
  sectionTitle: {
    fontSize: '1.15rem',
    color: '#0f172a',
    marginBottom: '14px',
  },
  text: {
    color: '#475569',
    fontSize: '0.95rem',
    lineHeight: 1.8,
    margin: '8px 0',
  },
  form: {
    display: 'grid',
    gap: '14px',
  },
  input: {
    borderRadius: '16px',
    border: '1px solid rgba(148, 163, 184, 0.45)',
    padding: '14px 16px',
    fontSize: '0.95rem',
    outline: 'none',
    background: '#ffffff',
  },
  textarea: {
    borderRadius: '16px',
    border: '1px solid rgba(148, 163, 184, 0.45)',
    padding: '14px 16px',
    fontSize: '0.95rem',
    outline: 'none',
    resize: 'vertical',
    background: '#ffffff',
  },
  button: {
    borderRadius: '18px',
    border: 'none',
    background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
    color: '#fff',
    padding: '14px 20px',
    fontWeight: 700,
    cursor: 'pointer',
  },
};

export default Contact;
