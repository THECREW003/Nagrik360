import { Award } from "lucide-react";

export default function RewardCard({ points = 250, badge = "Community Hero", progress = 60 }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Award size={18} className="text-amber-500" />
        <h3 className="text-sm font-semibold text-gray-700">Rewards</h3>
      </div>
      <p className="text-2xl font-bold text-gray-800">+{points} Civic Points</p>
      <span className="inline-block mt-2 text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
        {badge}
      </span>
      <div className="mt-4">
        <div className="flex justify-between text-[11px] text-gray-500 mb-1">
          <span>Progress to next badge</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-amber-500 h-2 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}