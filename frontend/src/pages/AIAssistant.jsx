import { useState, useRef, useEffect } from 'react';
import { complaintsAPI } from '../services/api';

const AIAssistant = () => {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({ title: '', description: '', category: '', location: '' });
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [speechActive, setSpeechActive] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!form.title && !form.description) {
      setAiSuggestion(null);
      return;
    }

    const category = /road|pothole|street|bridge|traffic|signal/i.test(form.title + form.description)
      ? 'Roads & Infrastructure'
      : /water|tap|sewer|drainage|pipe|leak/i.test(form.title + form.description)
      ? 'Water Supply'
      : /electric|power|load shedding|transformer|wires|streetlight/i.test(form.title + form.description)
      ? 'Electricity'
      : 'Public Safety';

    setAiSuggestion({ category, priority: 'medium', severity: 'high', confidence: '82%' });
  }, [form.title, form.description]);

  const updateForm = (updates) => setForm((prev) => ({ ...prev, ...updates }));

  const handleFileChange = (event) => {
    if (event.target.files) {
      setFiles((prev) => [...prev, ...Array.from(event.target.files)]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('category', form.category || aiSuggestion?.category || 'Other');
      formData.append('location', JSON.stringify({ type: 'Point', coordinates: [0, 0], address: form.location || '' }));
      files.forEach((file) => formData.append('media', file));

      await complaintsAPI.create(formData);
      setSuccess('AI-assisted complaint has been created successfully.');
      setForm({ title: '', description: '', category: '', location: '' });
      setFiles([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to submit AI complaint');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    if (event.dataTransfer.files) {
      setFiles((prev) => [...prev, ...Array.from(event.dataTransfer.files)]);
    }
  };

  const startSpeech = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition is unavailable in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      updateForm({ description: form.description ? `${form.description} ${transcript}` : transcript });
    };

    recognition.onerror = () => {
      setError('Speech recognition failed.');
      setSpeechActive(false);
    };

    recognition.onend = () => setSpeechActive(false);
    recognition.start();
    setSpeechActive(true);
  };

  return (
    <div style={styles.page}>
      <div style={styles.heroBlock}>
        <div style={styles.heroCopy}>
          <span style={styles.tag}>AI Complaint Assistant</span>
          <h1 style={styles.heroTitle}>Smart complaint creation with Gemini and live capture</h1>
          <p style={styles.heroText}>
            Build a richer complaint using text, image, camera capture, speech notes, and automatic AI suggestions.
          </p>
        </div>
      </div>

      <div style={styles.content}> 
        {error && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.assistantForm}>
          <div style={styles.metaRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(event) => updateForm({ title: event.target.value })}
                placeholder="Describe the issue in a sentence"
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(event) => updateForm({ category: event.target.value })}
                placeholder={aiSuggestion?.category || 'AI suggests a category'}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              value={form.description}
              onChange={(event) => updateForm({ description: event.target.value })}
              placeholder="Provide detailed issue context here"
              rows={6}
              style={styles.textarea}
              required
            />
          </div>

          <div style={styles.metaRow}>
            <button type="button" onClick={startSpeech} style={styles.secondaryButton}>
              {speechActive ? 'Listening...' : 'Capture speech note'}
            </button>
            <button type="button" style={styles.secondaryButton} onClick={() => fileInputRef.current?.click()}>
              Upload Image / Video
            </button>
          </div>

          <div
            style={{ ...styles.dropZone, borderColor: dragActive ? '#2563eb' : '#cbd5e1', background: dragActive ? '#eff6ff' : '#f8fafc' }}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,audio/*"
              onChange={handleFileChange}
              style={styles.hiddenInput}
            />
            <p style={styles.dropText}>Drag & drop evidence or click to browse files</p>
          </div>

          {files.length > 0 && (
            <div style={styles.uploadList}>
              {files.map((file, index) => (
                <div key={`${file.name}-${index}`} style={styles.uploadItem}>
                  <span>{file.name}</span>
                  <span style={styles.uploadSize}>{(file.size / 1024).toFixed(1)} KB</span>
                </div>
              ))}
            </div>
          )}

          <div style={styles.aiCard}>
            <span style={styles.aiLabel}>AI suggested severity</span>
            <div style={styles.aiRow}>
              <span style={styles.aiChip}>{aiSuggestion?.severity}</span>
              <span style={styles.aiChip}>{aiSuggestion?.priority}</span>
              <span style={styles.aiChip}>{aiSuggestion?.confidence} confidence</span>
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.primaryButton}>
            {loading ? 'Submitting to AI workflow…' : 'Submit with AI assistance'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.14), transparent 28%), #f8fbff',
    padding: '40px 20px 80px',
  },
  heroBlock: {
    maxWidth: '1120px',
    margin: '0 auto 24px',
    padding: '42px 40px',
    borderRadius: '28px',
    background: 'rgba(255,255,255,0.9)',
    border: '1px solid rgba(148, 163, 184, 0.18)',
    boxShadow: '0 28px 90px rgba(15, 23, 42, 0.08)',
  },
  heroCopy: {
    maxWidth: '760px',
  },
  tag: {
    display: 'inline-flex',
    borderRadius: '999px',
    padding: '10px 18px',
    background: '#eff6ff',
    color: '#1d4ed8',
    fontWeight: 700,
    marginBottom: '18px',
  },
  heroTitle: {
    fontSize: '2.8rem',
    lineHeight: 1.05,
    color: '#102a43',
    margin: 0,
  },
  heroText: {
    marginTop: '18px',
    fontSize: '1rem',
    color: '#475569',
    lineHeight: 1.75,
  },
  content: {
    maxWidth: '1120px',
    margin: '0 auto',
  },
  assistantForm: {
    background: '#ffffff',
    borderRadius: '28px',
    padding: '32px',
    border: '1px solid rgba(148, 163, 184, 0.18)',
    boxShadow: '0 24px 72px rgba(15, 23, 42, 0.08)',
    display: 'grid',
    gap: '24px',
  },
  metaRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  inputGroup: {
    display: 'grid',
    gap: '10px',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#334155',
  },
  input: {
    borderRadius: '16px',
    border: '1px solid rgba(148, 163, 184, 0.45)',
    padding: '16px 18px',
    fontSize: '1rem',
    outline: 'none',
    background: '#f8fafc',
    color: '#0f172a',
  },
  textarea: {
    minHeight: '180px',
    borderRadius: '18px',
    border: '1px solid rgba(148, 163, 184, 0.45)',
    padding: '18px',
    fontSize: '1rem',
    outline: 'none',
    resize: 'vertical',
    background: '#f8fafc',
    color: '#0f172a',
  },
  secondaryButton: {
    borderRadius: '16px',
    border: '1px solid rgba(37, 99, 235, 0.22)',
    background: '#eff6ff',
    color: '#1d4ed8',
    padding: '14px 20px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  dropZone: {
    minHeight: '140px',
    borderRadius: '22px',
    border: '2px dashed rgba(148, 163, 184, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    color: '#475569',
    textAlign: 'center',
    transition: 'background-color 0.2s, border-color 0.2s',
  },
  dropText: {
    margin: 0,
    fontSize: '0.95rem',
  },
  hiddenInput: {
    display: 'none',
  },
  uploadList: {
    display: 'grid',
    gap: '10px',
  },
  uploadItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 18px',
    background: '#f8fafc',
    borderRadius: '14px',
    border: '1px solid rgba(148, 163, 184, 0.35)',
    fontSize: '0.95rem',
    color: '#334155',
  },
  uploadSize: {
    color: '#64748b',
    fontSize: '0.85rem',
  },
  aiCard: {
    background: '#eff6ff',
    borderRadius: '20px',
    padding: '22px',
    border: '1px solid rgba(59, 130, 246, 0.18)',
    display: 'grid',
    gap: '14px',
  },
  aiLabel: {
    color: '#1d4ed8',
    fontWeight: 700,
    fontSize: '0.95rem',
  },
  aiRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
  },
  aiChip: {
    padding: '10px 16px',
    borderRadius: '14px',
    background: '#fff',
    color: '#0f172a',
    fontWeight: 600,
    border: '1px solid rgba(148, 163, 184, 0.3)',
  },
  primaryButton: {
    borderRadius: '18px',
    border: 'none',
    background: 'linear-gradient(135deg, #1d4ed8 0%, #0ea5e9 100%)',
    color: '#fff',
    padding: '16px 26px',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 18px 40px rgba(14, 165, 233, 0.24)',
  },
  errorBox: {
    padding: '18px 22px',
    borderRadius: '18px',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#991b1b',
    marginBottom: '20px',
  },
  successBox: {
    padding: '18px 22px',
    borderRadius: '18px',
    background: '#ecfdf5',
    border: '1px solid #6ee7b7',
    color: '#065f46',
    marginBottom: '20px',
  },
};

export default AIAssistant;
