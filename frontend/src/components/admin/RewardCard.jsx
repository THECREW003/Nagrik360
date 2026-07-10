import { rewards } from "../../data/dummyData";

export default function RewardCard() {
  const items = [
    { label: "Total Reward Points", value: rewards.totalPoints.toLocaleString(), icon: "⭐" },
    { label: "Badges Earned", value: rewards.badgesEarned, icon: "🏅" },
    { label: "Rewards Distributed", value: rewards.rewardsDistributed, icon: "🎁" },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Citizen Rewards Overview</h3>
      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.label} className="text-center border border-gray-100 rounded-md py-4">
            <span className="text-xl">{item.icon}</span>
            <p className="text-lg font-bold text-gray-800 mt-1">{item.value}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}