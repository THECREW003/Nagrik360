import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ComplaintForm() {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  
  // Geolocation states
  const [coords, setCoords] = useState(null);
  const [fetchingGps, setFetchingGps] = useState(false);
  const [gpsStatus, setGpsStatus] = useState("Location Not Linked");

  // Voice recognition states
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);

  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition on Mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const currentResultIndex = event.resultIndex;
      const transcript = event.results[currentResultIndex][0].transcript;
      setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleVoiceInput = () => {
    if (!voiceSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Speech initialization failure:", err);
      }
    }
  };

  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus("Telemetry unsupported by browser");
      return;
    }

    setFetchingGps(true);
    setGpsStatus("Locking satellites...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(5);
        const lng = position.coords.longitude.toFixed(5);
        setCoords({ latitude: lat, longitude: lng });
        setGpsStatus(`Connected: ${lat}, ${lng}`);
        setFetchingGps(false);
      },
      (error) => {
        console.error(error);
        setGpsStatus("Access denied. Check location permissions.");
        setFetchingGps(false);
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  const startLiveCamera = async () => {
    try {
      setIsCameraActive(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = mediaStream;
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      console.error("Camera access failed", err);
      setIsCameraActive(false);
    }
  };

  const captureSnapshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      setImagePreview(canvas.toDataURL("image/jpeg"));
      stopLiveCamera();
    }
  };

  const stopLiveCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const localRecords = localStorage.getItem("myComplaints");
    const runningComplaints = localRecords ? JSON.parse(localRecords) : [];
    const generatedTicket = `TKT-${Math.floor(10000 + Math.random() * 89999)}`;
    
    const newComplaint = {
      ticket: generatedTicket,
      subject: description || "New infrastructure record filed via input desk.",
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      status: "Submitted",
      priority: "Medium",
      department: "Roads Department",
      beforeSrc: imagePreview || null,
      latitude: coords ? coords.latitude : null,
      longitude: coords ? coords.longitude : null
    };

    runningComplaints.unshift(newComplaint);
    localStorage.setItem("myComplaints", JSON.stringify(runningComplaints));
    
    stopLiveCamera();
    if (recognitionRef.current) recognitionRef.current.stop();
    navigate(`/track?id=${generatedTicket}`);
  };

  return (
    <div className="flex-1 min-h-screen bg-slate-900 px-4 py-10 flex items-center justify-center font-sans text-slate-900">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl p-6 md:p-8 border border-slate-200">
        <h2 className="text-xl font-bold tracking-tight mb-1 text-slate-950">Report Infrastructure Issue</h2>
        <p className="text-xs text-slate-500 mb-6 uppercase tracking-wider">Public Works Grievance Intake Desk</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Geolocation Selector Module */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Hardware Telemetry Location
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={handleFetchLocation}
                disabled={fetchingGps}
                className={`px-4 py-2 rounded font-medium text-xs tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-2 border ${
                  coords 
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100" 
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                }`}
              >
                {fetchingGps ? (
                  <>
                    <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                    Pinging GPS...
                  </>
                ) : coords ? (
                  "Update GPS Location"
                ) : (
                  "Select Current Live Location"
                )}
              </button>
              
              <div className="flex-1 flex items-center px-3 py-2 bg-white rounded border border-slate-200 text-xs font-mono text-slate-600 shadow-inner min-h-[38px]">
                {gpsStatus}
              </div>
            </div>
          </div>

          {/* Camera Visual Evidence Section */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Visual Evidence Capture
            </label>
            
            {isCameraActive ? (
              <div className="relative rounded-lg overflow-hidden bg-black border border-slate-800 shadow-md">
                <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover" />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 px-4">
                  <button type="button" onClick={captureSnapshot} className="px-4 py-2 bg-emerald-700 text-white font-medium rounded text-xs tracking-wider uppercase shadow-md hover:bg-emerald-800 transition">
                    Capture Frame
                  </button>
                  <button type="button" onClick={stopLiveCamera} className="px-4 py-2 bg-slate-800 text-slate-300 font-medium rounded text-xs tracking-wider uppercase hover:bg-slate-700 transition">
                    Cancel
                  </button>
                </div>
              </div>
            ) : imagePreview ? (
              <div className="relative rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                <img src={imagePreview} alt="Intake data preview" className="w-full h-48 object-cover" />
                <button type="button" onClick={startLiveCamera} className="absolute top-3 right-3 bg-slate-900/90 text-white text-xs px-2.5 py-1.5 rounded hover:bg-slate-950 transition tracking-wider uppercase">
                  Change Photo
                </button>
              </div>
            ) : (
              <button type="button" onClick={startLiveCamera} className="w-full h-24 border border-dashed border-slate-300 hover:border-slate-400 rounded-lg flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-slate-600 transition bg-slate-50">
                <span className="text-xs font-bold tracking-wider uppercase">Open Live Verification Camera</span>
              </button>
            )}
          </div>

          {/* Restored Voice Integration & Issue Context Textarea */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Issue Context Details
              </label>
              {voiceSupported && (
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`px-3 py-1 rounded text-xs font-bold tracking-wider uppercase border transition-all ${
                    isListening
                      ? "bg-red-50 text-red-700 border-red-300 animate-pulse"
                      : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {isListening ? "Listening (Click to Stop)" : "Activate Voice Dictation"}
                </button>
              )}
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide standard description variables relating to structural failure parameters..."
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm font-sans focus:border-slate-950 focus:ring-1 focus:ring-slate-950 outline-none transition shadow-sm placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-950 text-white py-3 rounded-lg font-bold text-xs tracking-widest uppercase shadow-md hover:bg-slate-900 transition active:scale-[0.99]"
          >
            Submit Complaint Record
          </button>

        </form>
      </div>
    </div>
  );
}