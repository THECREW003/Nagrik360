// Reusable KPI card used across the top of the dashboard.
export default function StatusCard({ label, value, trend, trendUp, icon, color }) {
  return (
    <div className={`bg-white rounded-lg border-t-4 ${color} border border-gray-200 p-5 shadow-sm`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            trendUp ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
          }`}
        >
          {trendUp ? "▲" : "▼"} {trend}
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}