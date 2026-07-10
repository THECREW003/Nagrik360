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
      className="flex-1 bg-cover bg-center bg-fixed min-h-screen py-10 px-4 flex items-center"
      style={{ 
        fontFamily: "Arial, Helvetica, sans-serif",
        // Dynamic abstract digital connectivity architecture overlay background
        backgroundImage: `
          linear-gradient(to bottom, rgba(15, 23, 42, 0.82), rgba(30, 41, 59, 0.91)),
          url('https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcRLDHcon_VCt6dIaTHq3VCk5K4gzUMHcw3DeOoA4XQvOTHnPtvvtFjcaK-NMuY_8sIpnmNrsOCcaOLzwOw')
        `,
      }}
    >
      <main className="max-w-6xl mx-auto w-full px-2">
        {/* Main interactive grid panels section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">
          
          {/* Main CTA panel - Blended glass panel accent */}
          <div
            onClick={() => goToReport("text")}
            className="md:col-span-8 bg-white/95 backdrop-blur-md border border-white/20 p-8 md:p-10 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl group rounded-xl"
          >
            <div>
              <span className="font-mono text-[10px] tracking-widest uppercase text-indigo-600 font-bold mb-4 block">
                Smart Grievance Platform Engine
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4 leading-tight">
                Report Local Public Infrastructure Issues
              </h1>
              <p className="text-sm text-slate-600 max-w-xl mb-8 leading-relaxed">
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
              className="bg-indigo-600 text-white font-mono text-xs tracking-widest uppercase py-4 px-6 rounded-lg hover:bg-indigo-700 transition-all w-fit flex items-center gap-3 shadow-md shadow-indigo-600/20 group-hover:translate-x-1 duration-200"
            >
              Click Here To Lodge New Grievance
              <span>→</span>
            </button>
          </div>

          {/* Track status panel */}
          <div className="md:col-span-4 bg-white/95 backdrop-blur-md border border-white/20 p-8 flex flex-col justify-center transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl rounded-xl">
            <span className="text-3xl mb-3 block">📊</span>
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Check Complaint Status
            </h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Enter your unique reference number to track live updates on
              your reported issue.
            </p>
            <form onSubmit={handleTrack} className="flex flex-col gap-2">
              <label
                className="font-mono text-[10px] tracking-widest uppercase text-slate-400 font-bold"
                htmlFor="ref-number"
              >
                Reference Number
              </label>
              <input
                id="ref-number"
                type="text"
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
                placeholder="e.g. GRV-2026-8839"
                className="border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-indigo-600 focus:bg-white mb-3 rounded-md transition-all text-slate-900"
              />
              <button
                type="submit"
                className="bg-slate-900 text-white font-mono text-xs tracking-widest uppercase py-3 rounded-md hover:bg-indigo-600 shadow-md transition-colors duration-200"
              >
                Query System
              </button>
            </form>
          </div>
        </div>

        {/* Alternative intake lanes section */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] flex-grow bg-white/10" />
            <h3 className="font-mono text-[11px] tracking-widest uppercase text-slate-400 font-bold">
              Alternative Filing Methods
            </h3>
            <div className="h-[1px] flex-grow bg-white/10" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filingMethods.map((m) => (
              <div
                key={m.title}
                onClick={() => {
                  if (m.mode) goToReport(m.mode);
                }}
                className={`p-6 transition-all duration-300 border rounded-xl ${
                  m.mode
                    ? "bg-white/95 border-white/20 hover:bg-white hover:scale-[1.03] hover:shadow-xl cursor-pointer"
                    : "bg-white/70 border-white/10 opacity-60 cursor-default"
                }`}
              >
                <div className="flex items-center gap-3 mb-3 pointer-events-none">
                  <span className="text-lg bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-sm">
                    {m.icon}
                  </span>
                  <h4 className="font-mono text-xs tracking-wide font-extrabold text-slate-900 uppercase">
                    {m.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pointer-events-none">
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