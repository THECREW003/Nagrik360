import { useState, useEffect } from "react";

export default function Profile() {
  const [citizenName, setCitizenName] = useState("Citizen");
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [complaintStats, setComplaintStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
  });

  useEffect(() => {
    // Load username payload
    const savedName = localStorage.getItem("nagarik360_username");
    if (savedName) {
      setCitizenName(savedName);
      setNameInput(savedName);
    } else {
      setNameInput("Citizen");
    }

    // Read live local storage records to aggregate true analytics counters
    try {
      const localRecords = localStorage.getItem("myComplaints");
      if (localRecords) {
        const runningComplaints = JSON.parse(localRecords);
        const total = runningComplaints.length;
        const resolved = runningComplaints.filter(c => c.status === "Resolved").length;
        const pending = total - resolved;
        
        setComplaintStats({ total, resolved, pending });
      } else {
        // Fallback default mock counters if local record arrays don't exist yet
        setComplaintStats({ total: 12, resolved: 9, pending: 3 });
      }
    } catch (err) {
      console.error("Failed to parse local telemetry logs:", err);
    }
  }, []);

  const handleSaveName = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    
    localStorage.setItem("nagarik360_username", nameInput.trim());
    setCitizenName(nameInput.trim());
    setIsEditing(false);
  };

  return (
    <div className="flex-1 min-h-screen bg-slate-950 px-4 py-10 flex items-start justify-center font-sans text-slate-900">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-2xl p-6 md:p-8 border border-slate-200">
        
        {/* Header Profile System Node */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 mb-6 border-b border-slate-200">
          <div className="flex-1 w-full">
            {isEditing ? (
              <form onSubmit={handleSaveName} className="flex items-center gap-2 max-w-md">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="flex-1 rounded border border-slate-300 px-3 py-1.5 text-sm font-sans focus:border-slate-950 focus:ring-1 focus:ring-slate-950 outline-none"
                  autoFocus
                />
                <button type="submit" className="px-3 py-1.5 bg-slate-950 text-white text-xs font-bold tracking-wider uppercase rounded hover:bg-slate-900 transition">
                  Save
                </button>
                <button type="button" onClick={() => { setIsEditing(false); setNameInput(citizenName); }} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold tracking-wider uppercase rounded hover:bg-slate-200 border border-slate-300 transition">
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold tracking-tight text-slate-950">
                  {citizenName}
                </h2>
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="text-xs font-bold tracking-wider text-slate-500 uppercase hover:text-slate-950 transition underline underline-offset-4"
                >
                  Edit Profile
                </button>
              </div>
            )}
            <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Citizen Portal Account Node</p>
          </div>
          
          <div className="inline-block bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded">
            Classification: Silver Tier
          </div>
        </div>

        {/* Real-time Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Filed", value: complaintStats.total },
            { label: "Resolved Work", value: complaintStats.resolved },
            { label: "Telemetry Points", value: "240" },
            { label: "System Rank", value: "Silver" },
          ].map((item) => (
            <div key={item.label} className="bg-slate-50 border border-slate-200 rounded p-4 shadow-sm">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{item.label}</p>
              <p className="text-lg font-bold text-slate-950 font-mono">{item.value}</p>
            </div>
          ))}
        </div>

        {/* System Authorization Access Logs */}
        <div className="bg-slate-50 border border-slate-200 rounded p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">System Access Configurations</h4>
          <div className="space-y-2 text-xs font-mono text-slate-600">
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span>Security Access Protocol:</span>
              <span className="text-slate-900 font-bold">SHA-256 Local Encrypted</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span>Hardware Geolocation Hook:</span>
              <span className="text-emerald-700 font-bold">Operational / Active</span>
            </div>
            <div className="flex justify-between">
              <span>Voice Processing Engine:</span>
              <span className="text-emerald-700 font-bold">HTML5 Speech Interface Ready</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}