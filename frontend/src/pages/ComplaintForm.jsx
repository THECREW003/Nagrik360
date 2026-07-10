import { useState, useRef } from "react";

const MOCK_CATEGORIES = ["Pothole", "Garbage", "Streetlight", "Water Leak", "Flooding"];

export default function ComplaintForm() {
  const [inputMode, setInputMode] = useState("text"); // text | voice | photo
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // --- Location ---
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle");

  // --- Voice ---
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcribing, setTranscribing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // --- Photo ---
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [analyzingPhoto, setAnalyzingPhoto] = useState(false);
  const [aiTag, setAiTag] = useState(null);
  const fileInputRef = useRef(null);

  // --- Live camera ---
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraStreamRef = useRef(null);

  /* ---------------- GPS ---------------- */
  const captureLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      return;
    }
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationStatus("success");
      },
      () => setLocationStatus("error")
    );
  };

  /* ---------------- Voice recording ---------------- */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied or unavailable:", err);
      alert("Couldn't access microphone. Please allow microphone permission and try again.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const transcribeAudio = () => {
    // MOCK: In production, send `audioBlob` to your backend:
    //   const formData = new FormData();
    //   formData.append("audio", audioBlob, "complaint.webm");
    //   const res = await axios.post("/api/transcribe", formData);
    //   setDescription(res.data.text);
    setTranscribing(true);
    setTimeout(() => {
      setDescription(
        "There is a large pothole near the main road. It has been causing trouble for two-wheelers, especially at night."
      );
      setTranscribing(false);
    }, 1800);
  };

  /* ---------------- Photo upload ---------------- */
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setAiTag(null);
  };

  const analyzePhoto = () => {
    // MOCK: In production, send `photoFile` to your backend:
    //   const formData = new FormData();
    //   formData.append("image", photoFile);
    //   const res = await axios.post("/api/analyze-image", formData);
    //   setAiTag(res.data.category);
    setAnalyzingPhoto(true);
    setTimeout(() => {
      const random = MOCK_CATEGORIES[Math.floor(Math.random() * MOCK_CATEGORIES.length)];
      setAiTag(random);
      setAnalyzingPhoto(false);
    }, 1600);
  };

  /* ---------------- Live camera ---------------- */
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      cameraStreamRef.current = stream;
      setCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 0);
    } catch (err) {
      console.error("Camera access denied or unavailable:", err);
      alert("Couldn't access camera. Please allow camera permission and try again.");
    }
  };

  const closeCamera = () => {
    cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    cameraStreamRef.current = null;
    setCameraOpen(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" });
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(blob));
        setAiTag(null);
        closeCamera();
      },
      "image/jpeg",
      0.9
    );
  };

  /* ---------------- Submit ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!description.trim() && !audioBlob && !photoFile) {
      alert("Please provide a description, voice note, or photo before submitting.");
      return;
    }

    const complaint = {
      description,
      hasAudio: !!audioBlob,
      hasPhoto: !!photoFile,
      aiTag,
      location,
      timestamp: new Date().toISOString(),
    };

    console.log("Complaint submitted:", complaint);
    // Later: axios.post("/api/complaints", complaint or FormData with files)

    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setDescription("");
    setLocation(null);
    setLocationStatus("idle");
    setAudioBlob(null);
    setAudioUrl(null);
    setPhotoFile(null);
    setPhotoPreview(null);
    setAiTag(null);
    setInputMode("text");
  };

  if (submitted) {
    return (
      <div className="flex-1 bg-white px-6 py-10">
        <div className="max-w-xl mx-auto border border-gray-300 p-8 text-center">
          <h2 className="text-xl font-bold text-[#0f172a] mb-2">
            Complaint Submitted
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Your complaint has been recorded and routed for review.
          </p>
          <button
            onClick={resetForm}
            className="bg-[#0f172a] text-white px-6 py-2.5 text-sm font-medium hover:bg-[#1e293b]"
          >
            Report Another Issue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white px-6 py-10" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto border border-gray-300 p-8">
        <h2 className="text-xl font-bold text-[#0f172a] mb-6">Report an Issue</h2>

        {/* Mode switcher */}
        <div className="flex gap-3 mb-6">
          {[
            { key: "text", label: "📝 Text" },
            { key: "voice", label: "🎤 Voice" },
            { key: "photo", label: "📷 Photo" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setInputMode(tab.key)}
              className={`flex-1 border py-2 text-sm font-medium ${
                inputMode === tab.key
                  ? "border-[#0f172a] bg-gray-100 text-[#0f172a]"
                  : "border-gray-300 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TEXT MODE */}
        {inputMode === "text" && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Describe the issue
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Large pothole near ZP High School, two children fell yesterday."
              rows={4}
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#0f172a]"
            />
          </div>
        )}

        {/* VOICE MODE */}
        {inputMode === "voice" && (
          <div className="mb-6 border border-gray-300 p-5">
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`relative w-16 h-16 rounded-full flex items-center justify-center text-xl text-white ${
                  isRecording ? "bg-red-600" : "bg-[#0f172a]"
                }`}
              >
                {isRecording && (
                  <span className="absolute inset-0 rounded-full bg-red-400 opacity-60 animate-ping" />
                )}
                <span className="relative">{isRecording ? "■" : "🎤"}</span>
              </button>
              <p className="text-xs text-gray-500 mt-3">
                {isRecording ? "Recording... tap to stop" : "Tap to start recording"}
              </p>
            </div>

            {audioUrl && !isRecording && (
              <div className="mt-5">
                <audio controls src={audioUrl} className="w-full mb-3" />
                {!description && (
                  <button
                    type="button"
                    onClick={transcribeAudio}
                    disabled={transcribing}
                    className="w-full border border-gray-300 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    {transcribing ? "Transcribing..." : "Convert to Text"}
                  </button>
                )}
                {description && (
                  <div className="border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                    {description}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* PHOTO MODE */}
        {inputMode === "photo" && (
          <div className="mb-6 border border-gray-300 p-5">
            {/* Live camera view */}
            {cameraOpen && (
              <div className="mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-h-64 object-cover bg-black"
                />
                <div className="flex gap-3 mt-3">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="flex-1 bg-[#0f172a] text-white py-2 text-sm hover:bg-[#1e293b]"
                  >
                    📸 Capture
                  </button>
                  <button
                    type="button"
                    onClick={closeCamera}
                    className="flex-1 border border-gray-300 py-2 text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}

            {/* Upload / preview zone - only show when camera isn't open */}
            {!cameraOpen && (
              <>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-400 bg-gray-50 py-8 text-center cursor-pointer"
                >
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Issue"
                      className="max-h-40 mx-auto object-cover"
                    />
                  ) : (
                    <>
                      <p className="text-2xl mb-2">📷</p>
                      <p className="text-sm text-gray-600">Click to upload a photo</p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>

                <button
                  type="button"
                  onClick={openCamera}
                  className="w-full mt-3 border border-gray-300 py-2 text-sm hover:bg-gray-50"
                >
                  📸 Take Photo Instead
                </button>

                {photoFile && !aiTag && (
                  <button
                    type="button"
                    onClick={analyzePhoto}
                    disabled={analyzingPhoto}
                    className="w-full mt-3 border border-gray-300 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    {analyzingPhoto ? "Analyzing photo..." : "Analyze Photo"}
                  </button>
                )}

                {aiTag && (
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Detected:</span>
                    <span className="font-medium bg-gray-100 border border-gray-300 px-2.5 py-1 text-[#0f172a]">
                      {aiTag}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* GPS - always visible regardless of mode */}
        <div className="mb-6">
          <button
            type="button"
            onClick={captureLocation}
            className="text-sm border border-gray-300 px-4 py-2 hover:bg-gray-50"
          >
            📍 Capture My Location
          </button>
          {locationStatus === "loading" && (
            <p className="text-xs text-gray-500 mt-2">Getting location...</p>
          )}
          {locationStatus === "success" && location && (
            <p className="text-xs text-emerald-700 mt-2">
              Location captured: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </p>
          )}
          {locationStatus === "error" && (
            <p className="text-xs text-red-600 mt-2">
              Couldn't get location. Please allow location access and try again.
            </p>
          )}
        </div>

        {/* GPS disclaimer */}
        <div className="border border-orange-300 bg-orange-50 p-4 mb-6 text-xs text-gray-800">
          <strong>Notice:</strong> Your device's GPS coordinates will be attached
          to this complaint to assist with department assignment and
          verification.
        </div>

        <button
          type="submit"
          className="w-full bg-[#0f172a] text-white py-3 text-sm font-medium hover:bg-[#1e293b]"
        >
          Submit Complaint
        </button>
      </form>
    </div>
  );
}