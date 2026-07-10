import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('citizen');
  const [authority, setAuthority] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const fallbackName = email ? email.split('@')[0].toUpperCase() : "CITIZEN USER";
    setLoggedInUser(fallbackName);

    if (loginType === 'admin') {
      localStorage.setItem('adminUser', email);
      localStorage.setItem('adminAuthority', authority);
      
      setShowSuccessPopup(true);
      setTimeout(() => {
        navigate('/demo');
      }, 1500);
    } else {
      // Aligned with Profile component requirements
      localStorage.setItem('nagarik360_username', fallbackName);
      localStorage.setItem('username', fallbackName);
      localStorage.setItem('citizenID', `NGR-CITIZEN-${Math.floor(1000 + Math.random() * 9000)}`);
      
      if (!localStorage.getItem('myComplaints')) {
        const structuralBaseline = [
          { ticket: "NGR1982", subject: "Broken Streetlight Mast Layer 3", date: "24/06/2026", status: "Resolved", priority: "Medium", department: "Electricity Board" },
          { ticket: "NGR1744", subject: "Solid Waste Accumulation at Corner Block", date: "02/05/2026", status: "Resolved", priority: "Low", department: "Sanitation Division" }
        ];
        localStorage.setItem('myComplaints', JSON.stringify(structuralBaseline));
      }

      setShowSuccessPopup(true);
      
      setTimeout(() => {
        navigate('/report');
      }, 1500);
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-slate-950 font-sans flex items-center justify-center py-12 px-4 relative text-slate-900">
      
      {/* AUTHENTICATION OVERLAY */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border-t-4 border-emerald-700 p-6 max-w-sm w-full text-center shadow-2xl space-y-4 rounded-lg">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-700 text-xl font-bold rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              OK
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider">Authentication Success</h3>
              <p className="text-xs text-slate-600 mt-2">
                User identifier verified securely for account profile Node: <span className="font-bold text-slate-950">{loggedInUser}</span>.
              </p>
            </div>
            <div className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
              Initializing component workspace redirection...
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 w-full max-w-md shadow-2xl rounded-xl overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-5 border-b border-slate-800 text-center">
          <h2 className="text-base font-bold uppercase tracking-widest">Nagarik360 Secure Access Portal</h2>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1.5">Select administrative credentials clearance node</p>
        </div>

        <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Operational Access Role</label>
          <select 
            value={loginType} 
            onChange={(e) => setLoginType(e.target.value)}
            className="w-full border border-slate-300 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-900 focus:outline-none focus:border-slate-950 rounded cursor-pointer"
          >
            <option value="citizen">Public Citizen Portal</option>
            <option value="admin">Government Official Infrastructure Access</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {loginType === 'admin' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Department Jurisdiction Clearance</label>
              <select
                required 
                value={authority} 
                onChange={(e) => setAuthority(e.target.value)}
                className="w-full border border-slate-300 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-900 focus:outline-none focus:border-slate-950 rounded"
              >
                <option value="" disabled>Select Department Assignment</option>
                <option value="sarpanch">Gram Panchayat Sarpanch Framework</option>
                <option value="municipality">Regional Municipal Ward Desk</option>
                <option value="roads">Roads and Buildings Division</option>
                <option value="sanitation">Sanitation and Waste Treatment System</option>
                <option value="electricity">Power Grid Distribution Administration</option>
              </select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Official User Identity Key</label>
            <input
              required 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="identifier@domain.in"
              className="w-full border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:outline-none focus:border-slate-950 rounded font-sans"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Security Access PIN / Password</label>
            <input
              required 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              className="w-full border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:outline-none focus:border-slate-950 rounded"
            />
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded text-[11px] text-slate-600 font-mono leading-normal">
            <span className="font-bold text-slate-900">SECURITY PROTOCOL ADVISORY:</span> Unauthorized session injection actions tracking active parameters via logging networks.
          </div>

          <button 
            type="submit" 
            className="w-full bg-slate-950 text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-slate-900 transition-colors rounded shadow-sm"
          >
            Verify Cryptographic Passcode
          </button>
        </form>
      </div>
    </div>
  );
}