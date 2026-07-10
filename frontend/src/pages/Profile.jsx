import { useState, useEffect } from "react";

export default function Profile() {
  const [citizenName, setCitizenName] = useState("Citizen");

  useEffect(() => {
    const savedName = localStorage.getItem("nagarik360_username");
    if (savedName) {
      setCitizenName(savedName);
    }
  }, []);

  return (
    <div className="flex-1 bg-slate-50 px-6 py-10">
      <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-md p-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">
          {citizenName}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
          {[
            ["Total", "12"],
            ["Resolved", "9"],
            ["Points", "240"],
            ["Rank", "Silver"],
          ].map(([label, value]) => (
            <div key={label} className="border border-slate-200 rounded-md py-4">
              <p className="text-lg font-semibold text-slate-800">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        <span className="inline-block bg-slate-200 text-slate-700 text-xs px-3 py-1 rounded-full">
          🥈 Silver Citizen
        </span>
      </div>
    </div>
  );
}