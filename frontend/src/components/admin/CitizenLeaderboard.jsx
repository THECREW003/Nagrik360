import { citizens } from "../../data/dummyData";

export default function CitizenLeaderboard() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-5 py-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">Top Citizens Leaderboard</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {citizens.map((c) => (
          <div key={c.name} className="px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center">
                {c.rank}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-800">{c.name}</p>
                <p className="text-xs text-gray-500">
                  {c.submitted} submitted · {c.resolved} resolved
                </p>
              </div>
            </div>
            <span className="text-sm font-semibold text-blue-700">{c.points} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}