import { useState, useRef } from "react";

const font = {
  display: { fontFamily: "'Fraunces', serif", fontWeight: 600 },
  mono: { fontFamily: "'IBM Plex Mono', monospace" },
};

function TrustBanner() {
  return (
    <div className="bg-[#0A1628] text-[#B8C4D9] text-xs py-2 px-6 text-center tracking-wide">
      Official Citizen Services Portal
    </div>
  );
}

/* ---------- 1. LANDING ---------- */
function LandingView({ onFileReport }) {
  const pillars = [
    {
      title: "AI Voice Describe",
      body: "Just speak naturally. Gemini extracts the issue and location.",
      icon: "🎙️",
    },
    {
      title: "Smart Photo Analysis",
      body: "Upload a picture; AI automatically detects damage type and severity.",
      icon: "📷",
    },
    {
      title: "Auto-Route & GPS",
      body: "Zero forms required. Automatically mapped to the exact municipal department.",
      icon: "📍",
    },
  ];

  return (
    <div className="bg-[#F6F7F9] min-h-screen">
      <TrustBanner />
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <span className="inline-block text-xs font-medium tracking-wide text-indigo-600 border border-indigo-200 bg-indigo-50 rounded-full px-3 py-1 mb-6">
          Powered by Gemini AI
        </span>
        <h1
          className="text-4xl md:text-5xl text-[#0A1628] mb-5 leading-[1.1]"
          style={font.display}
        >
          Your Voice, Instantly
          <br />
          Directed by AI.
        </h1>
        <p className="text-slate-600 max-w-lg mx-auto mb-8">
          Speak, snap a photo, or type — Nagarik360 understands the issue and
          routes it to the right department automatically.
        </p>
        <button
          onClick={onFileReport}
          className="bg-indigo-600 text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          File a Fresh Report
        </button>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((p) => (
          <div
            key={p.title}
            className="bg-white border border-slate-200 rounded-xl p-8 text-center hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-4">{p.icon}</div>
            <h3 className="font-semibold text-[#0A1628] mb-2">{p.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{p.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

/* ---------- 2. LOGIN / REGISTER ---------- */
function AuthView({ onAuth }) {
  const [mode, setMode] = useState("login");

  return (
    <div className="bg-[#F6F7F9] min-h-screen">
      <TrustBanner />
      <div className="flex items-center justify-center px-6 py-20">
        <div className="bg-white border border-slate-200 rounded-xl p-10 w-full max-w-sm">
          <h2
            className="text-xl text-[#0A1628] mb-1 text-center"
            style={font.display}
          >
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm text-slate-500 text-center mb-6">
            Secure citizen access
          </p>

          <div className="flex flex-col gap-3 mb-6">
            <input
              type="text"
              placeholder="Phone number"
              className="border border-slate-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {mode === "register" && (
              <input
                type="text"
                placeholder="Full name"
                className="border border-slate-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
          </div>

          <button
            onClick={onAuth}
            className="w-full bg-indigo-600 text-white rounded-md py-2.5 text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            {mode === "login" ? "Send OTP & Continue" : "Register & Continue"}
          </button>

          <p className="text-xs text-slate-500 text-center mt-5">
            {mode === "login" ? (
              <>
                New here?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-indigo-600 font-medium"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already registered?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-indigo-600 font-medium"
                >
                  Log in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- 3. ZERO-STATE DASHBOARD ---------- */
function DashboardView({ onFileReport, onTrack }) {
  return (
    <div className="bg-[#F6F7F9] min-h-screen">
      <TrustBanner />
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-8 text-3xl">
          🌤️
        </div>
        <h2 className="text-2xl text-[#0A1628] mb-2" style={font.display}>
          Welcome, Citizen. Your neighborhood is clear.
        </h2>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          You have no active complaints right now. Noticed something wrong
          nearby? Reporting it takes less than a minute.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onFileReport}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            File Your First Report
          </button>
          <button
            onClick={onTrack}
            className="border border-slate-300 text-[#0A1628] px-6 py-2.5 rounded-md text-sm font-medium hover:bg-white transition-colors"
          >
            View Sample Tracking
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- 4. AI-READY REPORT FORM ---------- */
function ReportView({ onSubmitted }) {
  const [description, setDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [tag, setTag] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const runAnalysis = () => {
    if (!description.trim()) return;
    setAnalyzing(true);
    setTag(null);
    setTimeout(() => {
      setAnalyzing(false);
      setTag("Pothole");
    }, 1600);
  };

  return (
    <div className="bg-[#F6F7F9] min-h-screen">
      <TrustBanner />
      <div className="max-w-xl mx-auto px-6 py-16">
        <h2 className="text-xl text-[#0A1628] mb-6" style={font.display}>
          Report an Issue
        </h2>

        <div className="bg-white border border-slate-200 rounded-xl p-8 mb-6">
          {/* Voice */}
          <div className="flex flex-col items-center mb-8">
            <button className="relative w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl">
              <span className="absolute inset-0 rounded-full bg-indigo-400 opacity-60 animate-ping" />
              <span className="relative">🎙️</span>
            </button>
            <p className="text-xs text-slate-500 mt-3">
              Tap to speak — Gemini will transcribe automatically
            </p>
          </div>

          {/* Text */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what's wrong in your own words..."
            rows={3}
            className="w-full border border-slate-300 rounded-md px-4 py-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Photo drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg py-8 text-center cursor-pointer mb-4 transition-colors ${
              dragOver
                ? "border-indigo-500 bg-indigo-50"
                : "border-slate-300 hover:border-slate-400"
            }`}
          >
            <p className="text-2xl mb-2">📷</p>
            <p className="text-sm text-slate-600">
              Drop a photo here, or click to upload
            </p>
            <p className="text-xs text-slate-400 mt-1">
              AI will assess damage type and severity
            </p>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
          </div>

          {/* AI processing preview */}
          {analyzing && (
            <div className="flex items-center gap-2 text-sm text-indigo-600 mb-4">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              Analyzing with Gemini...
            </div>
          )}
          {tag && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-slate-500">AI classified as</span>
              <span className="text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-2.5 py-1">
                {tag}
              </span>
            </div>
          )}

          <button
            onClick={tag ? onSubmitted : runAnalysis}
            className="w-full bg-indigo-600 text-white rounded-md py-3 text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            {tag ? "Submit Complaint" : "Analyze & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- 5. TRACK COMPLAINT ---------- */
function TrackView({ onBackToDashboard }) {
  const stepsList = ["Submitted", "Under Review", "Assigned", "In Progress", "Resolved"];
  const current = 2;

  return (
    <div className="bg-[#F6F7F9] min-h-screen">
      <TrustBanner />
      <div className="max-w-xl mx-auto px-6 py-16">
        <div className="bg-white border border-slate-200 rounded-xl p-8">
          <p className="text-xs text-indigo-600 mb-1" style={font.mono}>
            #NGR2041
          </p>
          <h2 className="text-lg font-semibold text-[#0A1628] mb-1">
            Pothole — Roads Department
          </h2>
          <p className="text-sm text-slate-500 mb-8">Filed moments ago</p>

          <div className="flex justify-between">
            {stepsList.map((step, i) => (
              <div key={step} className="flex-1 flex flex-col items-center text-center">
                <div
                  className={`w-3 h-3 rounded-full mb-2 ${
                    i <= current ? "bg-indigo-600" : "bg-slate-200"
                  }`}
                />
                <span className="text-xs text-slate-600">{step}</span>
              </div>
            ))}
          </div>

          <button
            onClick={onBackToDashboard}
            className="w-full mt-8 border border-slate-300 rounded-md py-2.5 text-sm font-medium hover:bg-slate-50"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- APP (state machine) ---------- */
export default function Demo() {
  const [view, setView] = useState("landing");

  if (view === "landing") return <LandingView onFileReport={() => setView("auth")} />;
  if (view === "auth") return <AuthView onAuth={() => setView("dashboard")} />;
  if (view === "dashboard")
    return (
      <DashboardView
        onFileReport={() => setView("report")}
        onTrack={() => setView("track")}
      />
    );
  if (view === "report") return <ReportView onSubmitted={() => setView("track")} />;
  if (view === "track") return <TrackView onBackToDashboard={() => setView("dashboard")} />;

  return null;
}