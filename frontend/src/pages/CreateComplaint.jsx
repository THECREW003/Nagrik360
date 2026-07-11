import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintsAPI } from '../services/api';

const suggestionRules = [
  { pattern: /road|pothole|street|bridge|traffic|signal/i, category: 'Roads & Infrastructure' },
  { pattern: /water|tap|sewer|drainage|pipe|leak/i, category: 'Water Supply' },
  { pattern: /electric|power|load shedding|transformer|wires|streetlight/i, category: 'Electricity' },
  { pattern: /toilet|sanitation|garbage|cleanliness|waste|sewage/i, category: 'Sanitation' },
  { pattern: /crime|police|safety|assault|danger|accident/i, category: 'Public Safety' },
  { pattern: /hospital|clinic|health|medicine|doctor|ambulance/i, category: 'Healthcare' },
  { pattern: /school|college|education|teacher|classroom/i, category: 'Education' },
  { pattern: /tree|park|pollution|environment|river|forest|noise/i, category: 'Environment' },
];

const CreateComplaint = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    severity: '',
  });
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [speechActive, setSpeechActive] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [autoFillAccepted, setAutoFillAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [rewardMessage, setRewardMessage] = useState('');

  useEffect(() => {
    const text = `${form.title} ${form.description}`.trim();
    if (!text) {
      setSuggestion(null);
      return;
    }

    const matched = suggestionRules.find((rule) => rule.pattern.test(text));
    const category = matched ? matched.category : 'Auto detect';
    let severity = 'medium';
    let priority = 'medium';

    if (/(urgent|emergency|immediate|critical|danger|hazard)/i.test(text)) {
      severity = 'high';
      priority = 'high';
    } else if (/(minor|low|moderate|request|soft)/i.test(text)) {
      severity = 'low';
      priority = 'low';
    }

    setSuggestion({ category, severity, priority });
  }, [form.title, form.description]);

  useEffect(() => {
    if (!form.title || !form.description) {
      setDuplicateWarning(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await complaintsAPI.checkDuplicate({ title: form.title, description: form.description });
        setDuplicateWarning(response.data);
      } catch {
        setDuplicateWarning(null);
      }
    }, 950);

    return () => clearTimeout(timer);
  }, [form.title, form.description]);

  useEffect(() => {
    return () => {
      stopCamera();
      stopSpeechRecognition();
    };
  }, []);

  const updateForm = (updates) => {
    setForm((prev) => ({ ...prev, ...updates }));
    if (error) setError(null);
  };

  const handleChange = (e) => {
    updateForm({ [e.target.name]: e.target.value });
  };

  const setFilesFromEvent = (incomingFiles) => {
    setFiles((prev) => [...prev, ...Array.from(incomingFiles)]);
  };

  const handleFileChange = (e) => {
    if (e.target.files) setFilesFromEvent(e.target.files);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setFilesFromEvent(event.dataTransfer.files);
    }
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera capture is not available on this device.');
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch {
      setError('Unable to access the camera. Please allow permission or use upload instead.');
    }
  };

  const stopCamera = () => {
    if (!stream) return;
    stream.getTracks().forEach((track) => track.stop());
    setStream(null);
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
        setFiles((prev) => [...prev, file]);
      }
    }, 'image/jpeg', 0.85);
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech-to-text is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');

      if (event.results[0].isFinal) {
        updateForm({ description: form.description ? `${form.description} ${transcript}` : transcript });
      }
    };

    recognition.onerror = () => {
      setError('Speech recognition failed. Please try again.');
      stopSpeechRecognition();
    };

    recognition.onend = () => {
      setSpeechActive(false);
      recognitionRef.current = null;
    };

    recognition.start();
    recognitionRef.current = recognition;
    setSpeechActive(true);
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setSpeechActive(false);
  };

  const toggleSpeech = () => {
    if (speechActive) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  };

  const fillLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is unavailable in this browser.');
      return;
    }

    setLocationStatus('Finding your location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const longitude = position.coords.longitude.toFixed(6);
        const latitude = position.coords.latitude.toFixed(6);
        updateForm({ location: `${longitude}, ${latitude}` });
        setLocationStatus('Location captured from your device.');
      },
      () => {
        setLocationStatus('Unable to read location. Please provide coordinates manually.');
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const applySuggestion = () => {
    if (!suggestion) return;
    updateForm({
      category: suggestion.category === 'Auto detect' ? '' : suggestion.category,
      severity: suggestion.severity,
    });
    setAutoFillAccepted(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      const selectedCategory = form.category || (autoFillAccepted && suggestion?.category !== 'Auto detect' ? suggestion.category : '');
      if (selectedCategory) formData.append('category', selectedCategory);
      if (form.severity) formData.append('severity', form.severity);

      if (form.location) {
        const coords = form.location.split(',').map((value) => parseFloat(value.trim()));
        if (coords.length === 2 && !Number.isNaN(coords[0]) && !Number.isNaN(coords[1])) {
          formData.append('location', JSON.stringify({ type: 'Point', coordinates: [coords[0], coords[1]], address: '' }));
        }
      }

      files.forEach((file) => formData.append('media', file));

      const response = await complaintsAPI.create(formData);
      setSuccess(`Complaint submitted successfully! Complaint ID: ${response.data.complaint.complaintId}`);
      setAiAnalysis(response.data.complaint.aiClassification || null);
      setRewardMessage(response.data.reward?.message || 'Thank you for raising your civic issue.');

      setForm({ title: '', description: '', category: '', location: '', severity: '' });
      setFiles([]);
      setAutoFillAccepted(false);
      setSuggestion(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      stopCamera();
      stopSpeechRecognition();

      setTimeout(() => navigate('/complaints'), 3200);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to submit complaint';
      const fieldErrors = err.response?.data?.errors;
      if (fieldErrors) {
        setError(fieldErrors.map((issue) => issue.message).join(', '));
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.headerPanel}>
        <div>
          <p style={styles.badge}>Nagarik360</p>
          <h1 style={styles.headerTitle}>Smart Civic Complaint Filing</h1>
          <p style={styles.headerText}>
            Use voice notes, camera capture, location auto-fill, and smart AI suggestions to file civic issues faster.
          </p>
        </div>
        <div style={styles.statsPanel}>
          <div style={styles.statCard}>
            <span style={styles.statValue}>Smart AI</span>
            <span style={styles.statLabel}>Category & priority</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statValue}>Multi-media</span>
            <span style={styles.statLabel}>Photos, audio, video</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statValue}>Secure</span>
            <span style={styles.statLabel}>Trusted submission</span>
          </div>
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.ribbon}>Premium complaint experience</div>

          {error && <div style={styles.error}>{error}</div>}
          {success && (
            <div style={styles.successCard}>
              <div style={styles.successIcon}>✓</div>
              <div>
                <h2 style={styles.successTitle}>Complaint submitted</h2>
                <p style={styles.successText}>{success}</p>
                <p style={styles.successSubtext}>{rewardMessage}</p>
              </div>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.sectionGrid}>
                <div style={styles.sectionCard}>
                  <h2 style={styles.sectionTitle}>Issue details</h2>
                  <p style={styles.sectionHint}>Add location details, impact, and urgency to help officials respond quickly.</p>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="e.g., Pothole on main street near bus stop"
                      required
                      minLength={5}
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Description *</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Describe the issue clearly with time, severity, and local impact."
                      required
                      minLength={10}
                      rows={6}
                      style={styles.textarea}
                    />
                  </div>

                  <div style={styles.toolRow}>
                    <button type="button" style={styles.smallButton} onClick={toggleSpeech}>
                      {speechActive ? 'Stop voice note' : 'Record voice note'}
                    </button>
                    <button type="button" style={styles.smallButtonSecondary} onClick={fillLocation}>
                      Use my location
                    </button>
                  </div>
                  {locationStatus && <p style={styles.noteText}>{locationStatus}</p>}
                </div>

                <div style={styles.sectionCardLight}>
                  <h2 style={styles.sectionTitle}>Smart suggestions</h2>
                  <p style={styles.sectionHint}>AI recommends the best category and severity for your complaint.</p>
                  {suggestion ? (
                    <div style={styles.suggestionCard}>
                      <div style={styles.suggestionRow}>
                        <span style={styles.suggestionLabel}>Category</span>
                        <span style={styles.suggestionValue}>{suggestion.category}</span>
                      </div>
                      <div style={styles.suggestionRow}>
                        <span style={styles.suggestionLabel}>Priority</span>
                        <span style={styles.suggestionValue}>{suggestion.priority}</span>
                      </div>
                      <div style={styles.suggestionRow}>
                        <span style={styles.suggestionLabel}>Severity</span>
                        <span style={styles.suggestionValue}>{suggestion.severity}</span>
                      </div>
                      <button type="button" style={styles.applyButton} onClick={applySuggestion}>
                        Apply smart suggestion
                      </button>
                    </div>
                  ) : (
                    <p style={styles.noteText}>Enter more detail to generate a better suggestion.</p>
                  )}

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Category override</label>
                    <select name="category" value={form.category} onChange={handleChange} style={styles.select}>
                      <option value="">Use AI suggestion</option>
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
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Severity</label>
                    <select name="severity" value={form.severity} onChange={handleChange} style={styles.select}>
                      <option value="">Auto select</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Location coordinates</label>
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="77.1025, 28.7041"
                      style={styles.input}
                    />
                  </div>
                  <p style={styles.quickHint}>Enter longitude, latitude in that order.</p>
                </div>
              </div>

              <div style={styles.mediaSection}>
                <div style={styles.mediaHeader}>
                  <div>
                    <h2 style={styles.sectionTitle}>Evidence capture</h2>
                    <p style={styles.sectionHint}>Upload photos, audio, or video, or capture directly using your camera.</p>
                  </div>
                  <button type="button" style={styles.smallButtonSecondary} onClick={startCamera}>
                    Start camera
                  </button>
                </div>

                <div
                  style={{
                    ...styles.dropZone,
                    borderColor: dragActive ? '#f97316' : '#cbd5e1',
                    background: dragActive ? '#fff7ed' : '#f8fafc',
                  }}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                  <p style={styles.dropText}>Drag & drop evidence here, or click to browse files.</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,audio/*,video/*"
                    onChange={handleFileChange}
                    style={styles.hiddenFileInput}
                  />
                </div>

                {files.length > 0 && (
                  <div style={styles.fileList}>
                    {files.map((file, index) => (
                      <div key={`${file.name}-${index}`} style={styles.fileChip}>
                        <span>{file.name}</span>
                        <span style={styles.fileMeta}>{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                    ))}
                  </div>
                )}

                {cameraActive && (
                  <div style={styles.cameraPanel}>
                    <video ref={videoRef} style={styles.videoPreview} muted playsInline />
                    <div style={styles.cameraActions}>
                      <button type="button" style={styles.smallButton} onClick={capturePhoto}>
                        Capture photo
                      </button>
                      <button type="button" style={styles.smallButtonSecondary} onClick={stopCamera}>
                        Stop camera
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {duplicateWarning?.isDuplicate && (
                <div style={styles.duplicateWarning}>
                  <strong>Possible duplicate detected.</strong>
                  <p>{duplicateWarning.reason}</p>
                  {duplicateWarning.duplicateComplaint && (
                    <p style={styles.duplicateLink}>
                      Similar complaint: {duplicateWarning.duplicateComplaint.title} ({duplicateWarning.duplicateComplaint.complaintId})
                    </p>
                  )}
                </div>
              )}

              <button type="submit" disabled={loading} style={styles.submitButton}>
                {loading ? 'Submitting complaint...' : 'Submit complaint securely'}
              </button>
            </form>
          )}

          {aiAnalysis && success && (
            <div style={styles.aiResult}>
              <h3 style={styles.aiTitle}>AI classification summary</h3>
              <div style={styles.aiGrid}>
                <div style={styles.aiItem}>
                  <span style={styles.aiLabel}>Category</span>
                  <span style={styles.aiValue}>{aiAnalysis.category || 'N/A'}</span>
                </div>
                <div style={styles.aiItem}>
                  <span style={styles.aiLabel}>Priority</span>
                  <span style={styles.aiValue}>{aiAnalysis.priority || 'N/A'}</span>
                </div>
                <div style={styles.aiItem}>
                  <span style={styles.aiLabel}>Severity</span>
                  <span style={styles.aiValue}>{aiAnalysis.severity || 'N/A'}</span>
                </div>
                <div style={styles.aiItem}>
                  <span style={styles.aiLabel}>Department</span>
                  <span style={styles.aiValue}>{aiAnalysis.nagrik_department || 'Auto-assigned'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #eef2ff 0%, #ffffff 60%)',
    padding: '32px 16px 48px',
  },
  headerPanel: {
    maxWidth: '1140px',
    margin: '0 auto 24px',
    display: 'grid',
    gap: '24px',
    gridTemplateColumns: '1.4fr 1fr',
    alignItems: 'center',
  },
  badge: {
    display: 'inline-flex',
    padding: '8px 14px',
    borderRadius: '999px',
    background: '#1e40af',
    color: '#fff',
    fontWeight: 700,
    letterSpacing: '0.04em',
    marginBottom: '12px',
    fontSize: '0.85rem',
  },
  headerTitle: {
    fontSize: '2.4rem',
    margin: 0,
    color: '#0f172a',
    lineHeight: 1.05,
  },
  headerText: {
    margin: '12px 0 0',
    color: '#475569',
    maxWidth: '620px',
    fontSize: '1rem',
  },
  statsPanel: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
    gap: '16px',
  },
  statCard: {
    borderRadius: '18px',
    background: '#fff',
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
  },
  statValue: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#0f172a',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#64748b',
  },
  container: {
    maxWidth: '1140px',
    margin: '0 auto',
  },
  card: {
    position: 'relative',
    background: '#ffffff',
    borderRadius: '28px',
    padding: '36px',
    boxShadow: '0 24px 80px rgba(15, 23, 42, 0.08)',
    border: '1px solid rgba(148, 163, 184, 0.16)',
  },
  ribbon: {
    position: 'absolute',
    right: '24px',
    top: '24px',
    padding: '10px 16px',
    borderRadius: '999px',
    background: 'linear-gradient(90deg, #fb923c 0%, #f97316 100%)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.85rem',
    letterSpacing: '0.02em',
  },
  form: {
    display: 'grid',
    gap: '28px',
  },
  sectionGrid: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: '24px',
  },
  sectionCard: {
    background: '#f8fafc',
    padding: '24px',
    borderRadius: '20px',
    border: '1px solid #e2e8f0',
  },
  sectionCardLight: {
    background: '#ffffff',
    padding: '24px',
    borderRadius: '20px',
    border: '1px solid #e2e8f0',
  },
  sectionTitle: {
    margin: 0,
    color: '#0f172a',
    fontSize: '1.05rem',
    fontWeight: 700,
  },
  sectionHint: {
    color: '#475569',
    margin: '12px 0 20px',
    fontSize: '0.95rem',
    lineHeight: 1.6,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    color: '#334155',
    fontSize: '0.92rem',
    fontWeight: 600,
  },
  input: {
    padding: '14px 18px',
    borderRadius: '14px',
    border: '1px solid #cbd5e1',
    fontSize: '0.95rem',
    color: '#0f172a',
    outline: 'none',
  },
  textarea: {
    minHeight: '168px',
    padding: '14px 18px',
    borderRadius: '14px',
    border: '1px solid #cbd5e1',
    fontSize: '0.95rem',
    color: '#0f172a',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  select: {
    padding: '14px 18px',
    borderRadius: '14px',
    border: '1px solid #cbd5e1',
    fontSize: '0.95rem',
    color: '#0f172a',
    outline: 'none',
    background: '#ffffff',
  },
  toolRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '10px',
  },
  smallButton: {
    padding: '10px 16px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    background: '#ffffff',
    color: '#0f172a',
    cursor: 'pointer',
    fontWeight: 600,
  },
  smallButtonSecondary: {
    padding: '10px 16px',
    borderRadius: '12px',
    border: '1px solid transparent',
    background: '#eff6ff',
    color: '#1d4ed8',
    cursor: 'pointer',
    fontWeight: 600,
  },
  noteText: {
    color: '#475569',
    fontSize: '0.92rem',
    marginTop: '10px',
  },
  suggestionCard: {
    borderRadius: '18px',
    background: '#eef2ff',
    padding: '18px',
    border: '1px solid #c7d2fe',
    display: 'grid',
    gap: '12px',
  },
  suggestionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    fontSize: '0.95rem',
    color: '#0f172a',
  },
  suggestionLabel: {
    color: '#475569',
  },
  suggestionValue: {
    fontWeight: 700,
  },
  applyButton: {
    marginTop: '8px',
    padding: '12px 16px',
    borderRadius: '12px',
    border: 'none',
    background: '#1d4ed8',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
  },
  quickHint: {
    color: '#64748b',
    fontSize: '0.9rem',
    marginTop: '8px',
  },
  mediaSection: {
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid #e2e8f0',
    background: '#f8fafc',
    display: 'grid',
    gap: '18px',
  },
  mediaHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
  },
  dropZone: {
    position: 'relative',
    minHeight: '150px',
    borderRadius: '20px',
    border: '2px dashed #cbd5e1',
    padding: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    cursor: 'pointer',
  },
  dropText: {
    color: '#475569',
    fontSize: '0.95rem',
    maxWidth: '600px',
    margin: '0 auto',
  },
  hiddenFileInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
  },
  fileList: {
    display: 'grid',
    gap: '10px',
    marginTop: '12px',
  },
  fileChip: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    borderRadius: '14px',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    color: '#0f172a',
    fontSize: '0.92rem',
  },
  fileMeta: {
    color: '#64748b',
    fontSize: '0.82rem',
  },
  cameraPanel: {
    display: 'grid',
    gap: '12px',
  },
  videoPreview: {
    width: '100%',
    minHeight: '240px',
    borderRadius: '20px',
    background: '#0f172a',
    objectFit: 'cover',
  },
  cameraActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  duplicateWarning: {
    background: '#fff7ed',
    border: '1px solid #fbbf24',
    borderRadius: '16px',
    padding: '18px',
    color: '#92400e',
    fontSize: '0.95rem',
  },
  duplicateLink: {
    marginTop: '8px',
    color: '#1d4ed8',
    fontWeight: 600,
  },
  submitButton: {
    marginTop: '16px',
    width: '100%',
    padding: '16px 22px',
    borderRadius: '16px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 700,
    color: '#fff',
    background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
    cursor: 'pointer',
  },
  error: {
    background: '#fce7f3',
    color: '#9d174d',
    padding: '18px',
    borderRadius: '16px',
    marginBottom: '20px',
    fontWeight: 600,
  },
  successCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '20px',
    padding: '22px',
    marginBottom: '20px',
  },
  successIcon: {
    minWidth: '52px',
    minHeight: '52px',
    borderRadius: '50%',
    background: '#2563eb',
    color: '#fff',
    display: 'grid',
    placeItems: 'center',
    fontSize: '1.5rem',
    fontWeight: 700,
  },
  successTitle: {
    margin: 0,
    fontSize: '1.2rem',
    color: '#1e3a8a',
  },
  successText: {
    margin: '8px 0 0',
    color: '#334155',
  },
  successSubtext: {
    margin: '6px 0 0',
    color: '#475569',
  },
  aiResult: {
    background: '#f8fafc',
    borderRadius: '20px',
    padding: '22px',
    border: '1px solid #e2e8f0',
  },
  aiTitle: {
    margin: '0 0 18px',
    fontSize: '1rem',
    color: '#0f172a',
    fontWeight: 700,
  },
  aiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '14px',
  },
  aiItem: {
    display: 'grid',
    gap: '4px',
  },
  aiLabel: {
    color: '#475569',
    fontSize: '0.82rem',
  },
  aiValue: {
    color: '#0f172a',
    fontWeight: 700,
    fontSize: '0.95rem',
  },
};

export default CreateComplaint;