import { activities } from "../../data/dummyData";

export default function ActivityTimeline() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Activities</h3>
      <div className="relative pl-4 border-l-2 border-gray-100 space-y-5">
        {activities.map((a, i) => (
          <div key={i} className="relative">
            <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600" />
            <p className="text-sm font-medium text-gray-800">{a.type}</p>
            <p className="text-xs text-gray-500">{a.detail}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{a.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}