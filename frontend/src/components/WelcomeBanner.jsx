import React, { useEffect, useState } from 'react';

export default function WelcomeBanner() {
  const [citizenName, setCitizenName] = useState('');

  useEffect(() => {
    // Read user record securely on screen execution mount
    const savedName = localStorage.getItem('citizenName');
    if (savedName) {
      setCitizenName(savedName);
    }
  }, []);

  if (!citizenName) return null; // Hide banner completely if no session active

  return (
    <div className="bg-gradient-to-r from-orange-500 via-white to-green-600 border-b border-gray-300 px-6 py-2 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-xs font-bold text-gray-900 tracking-wide">
        <div className="flex items-center gap-1.5 bg-white/95 border border-gray-300 px-3 py-1 uppercase shadow-sm">
          <span className="text-base">🇮🇳</span>
          Welcome back, Counterpart Leader: <span className="text-blue-900 font-black">{citizenName}</span>
        </div>
        <span className="hidden sm:inline text-[10px] text-slate-800 font-mono tracking-tighter bg-white/70 px-2 py-1">
          🔐 SECURE PORTAL SESSION ACTIVE
        </span>
      </div>
    </div>
  );
}