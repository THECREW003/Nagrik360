import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  const [trackId, setTrackId] = useState("");

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackId.trim()) {
      navigate(`/track?id=${encodeURIComponent(trackId.trim())}`);
    }
  };

  const filingMethods = [
    {
      icon: "🎙️",
      title: "Audio / Voice Log",
      body: "Record a short voice memo describing the issue. Location is captured automatically.",
      mode: "voice",
    },
    {
      icon: "📷",
      title: "Photo Evidence",
      body: "Upload geo-tagged images of the infrastructure damage to speed up verification.",
      mode: "photo",
    },
    {
      icon: "💬",
      title: "Official WhatsApp",
      body: "Text 'Hi' to +1 800 360 NAV to lodge grievances via chat. Available 24/7.",
      mode: "whatsapp",
    },
  ];

  const goToReport = (mode) => {
    navigate("/report", { state: { mode } });
  };

  return (
    <div
      className="flex-1 bg-white"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
          {/* Main CTA panel */}
          <div
            onClick={() => goToReport("text")}
            className="md:col-span-8 bg-gray-100 border border-gray-300 p-10 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-gray-400"
          >
            <div>
              <span className="font-mono text-[11px] tracking-widest uppercase text-gray-500 mb-4 block">
                Grievance Redressal Portal
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-4 leading-snug">
                Report Local Public Infrastructure Issues
              </h1>
              <p className="text-sm text-gray-600 max-w-xl mb-8">
                Help maintain the integrity of your city. Use Nagarik360 to
                report damage to roads, streetlights, sanitation failures, or
                water leaks directly to the responsible departments.
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToReport("text");
              }}
              className="bg-[#0f172a] text-white font-mono text-xs tracking-widest uppercase py-4 px-8 hover:bg-[#1e293b] w-fit flex items-center gap-3"
            >
              Click Here To Lodge New Grievance
              <span>→</span>
            </button>
          </div>

          {/* Track status */}
          <div className="md:col-span-4 bg-white border border-gray-300 p-8 flex flex-col justify-center transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
            <span className="text-2xl mb-3 block">📊</span>
            <h2 className="text-lg font-bold text-[#0f172a] mb-2">
              Check Complaint Status
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Enter your unique reference number to track live updates on
              your reported issue.
            </p>
            <form onSubmit={handleTrack} className="flex flex-col gap-1.5">
              <label
                className="font-mono text-[10px] tracking-widest uppercase text-gray-400"
                htmlFor="ref-number"
              >
                Reference Number
              </label>
              <input
                id="ref-number"
                type="text"
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
                placeholder="e.g. GRV-2024-8839"
                className="border border-gray-300 px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[#0f172a] mb-3"
              />
              <button
                type="submit"
                className="bg-gray-100 border border-gray-300 text-[#0f172a] font-mono text-xs tracking-widest uppercase py-2.5 hover:bg-[#0f172a] hover:text-white transition-colors"
              >
                Query System
              </button>
            </form>
          </div>
        </div>

        {/* Alternative filing methods */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-grow bg-gray-300" />
            <h3 className="font-mono text-[11px] tracking-widest uppercase text-gray-500">
              Alternative Filing Methods
            </h3>
            <div className="h-px flex-grow bg-gray-300" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filingMethods.map((m) => (
              <div
                key={m.title}
                onClick={() => {
                  if (m.mode) goToReport(m.mode);
                }}
                className={`bg-gray-100 border border-gray-300 p-6 transition-all duration-300 ${
                  m.mode
                    ? "hover:bg-white hover:scale-105 hover:shadow-lg hover:border-gray-400 cursor-pointer"
                    : "opacity-70 cursor-default"
                }`}
              >
                <div className="flex items-center gap-3 mb-3 pointer-events-none">
                  <span className="text-lg bg-white border border-gray-300 p-2.5">{m.icon}</span>
                  <h4 className="font-mono text-xs tracking-wide font-bold text-[#0f172a] uppercase">
                    {m.title}
                  </h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed pointer-events-none">
                  {m.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}