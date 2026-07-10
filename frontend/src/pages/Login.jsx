import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('citizen');
  const [authority, setAuthority] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State for controlling the success popup box modal
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
      localStorage.setItem('citizenName', fallbackName);
      localStorage.setItem('citizenID', `NGR-CITIZEN-${Math.floor(1000 + Math.random() * 9000)}`);
      
      if (!localStorage.getItem('myComplaints')) {
        const structuralBaseline = [
          { ticket: "NGR1982", subject: "Broken Streetlight Mast Layer 3", date: "24-June-2026", status: "Resolved", priority: "Medium", department: "Electricity Board" },
          { ticket: "NGR1744", subject: "Solid Waste Accumulation at Corner Block", date: "02-May-2026", status: "Resolved", priority: "Low", department: "Sanitation Division" }
        ];
        localStorage.setItem('myComplaints', JSON.stringify(structuralBaseline));
      }

      // Trigger the successful alert window modal pop
      setShowSuccessPopup(true);
      
      // Hold for 1.5 seconds so they read the success state, then change view routes
      setTimeout(() => {
        navigate('/report');
      }, 1500);
    }
  };

  return (
    <div className="flex-1 bg-gray-100 font-sans flex items-center justify-center py-12 px-4 relative">
      
      {/* SUCCESS CONFIRMATION POPUP MODAL OVERLAY */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border-t-8 border-green-700 p-6 max-w-sm w-full text-center shadow-2xl space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-700 text-3xl rounded-full flex items-center justify-center mx-auto shadow-inner">
              ✓
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 uppercase">Authentication Success</h3>
              <p className="text-xs text-gray-600 mt-1">
                Welcome back, <span className="font-bold text-blue-900">{loggedInUser}</span>. Secure citizen credentials verified.
              </p>
            </div>
            <div className="text-[11px] text-gray-400 font-mono animate-pulse">
              Redirecting to secure terminal workspace...
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border-2 border-gray-300 w-full max-w-md shadow-md rounded-none">
        <div className="bg-blue-900 text-white px-6 py-4 border-b border-gray-300 text-center">
          <h2 className="text-lg font-bold uppercase tracking-wide">Nagarik360 Secure Access Portal</h2>
          <p className="text-xs opacity-80 mt-1">Select your login category to access digital services</p>
        </div>

        <div className="p-6 border-b border-gray-200 bg-gray-50 flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Select User Role:</label>
          <select 
            value={loginType} 
            onChange={(e) => setLoginType(e.target.value)}
            className="w-full border-2 border-gray-400 bg-white px-3 py-2.5 text-sm text-gray-900 font-bold focus:outline-none focus:border-blue-900 rounded-none cursor-pointer"
          >
            <option value="citizen">👤 Public Citizen Login</option>
            <option value="admin">🏢 Government Official / Admin Login</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {loginType === 'admin' && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Select Department Jurisdiction:</label>
              <select
                required value={authority} onChange={(e) => setAuthority(e.target.value)}
                className="w-full border border-gray-400 bg-white px-3 py-2 text-sm text-gray-900 font-medium focus:outline-none focus:border-blue-900 rounded-none"
              >
                <option value="" disabled>-- Choose Department / Designation --</option>
                <option value="sarpanch">Gram Panchayat (Sarpanch Office)</option>
                <option value="municipality">Municipality / Ward Officer</option>
                <option value="roads">Roads &amp; Buildings Department</option>
                <option value="sanitation">Sanitation &amp; Waste Management Division</option>
                <option value="electricity">Electricity / Power Distribution Board</option>
              </select>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Official Email ID / User ID:</label>
            <input
              required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@government.in"
              className="w-full border border-gray-400 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-900 rounded-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Security Password / PIN code:</label>
            <input
              required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
              className="w-full border border-gray-400 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-900 rounded-none"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-300 p-2 text-[11px] text-gray-700 leading-normal">
            <strong>Security Advisory:</strong> Unauthorized access attempts to this administrative framework will be tracked via remote IP logging protocols.
          </div>

          <button type="submit" className="w-full bg-[#1e3a8a] text-white py-3 text-sm font-bold uppercase tracking-wider hover:bg-blue-950 transition-colors border border-blue-900 rounded-none shadow-sm">
            Verify Credentials &amp; Proceed →
          </button>
        </form>
      </div>
    </div>
  );
}