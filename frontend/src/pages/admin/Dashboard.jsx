import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import StatusCard from "../../components/admin/StatusCard";
import AnalyticsCharts from "../../components/admin/AnalyticsCharts";
import ComplaintTable from "../../components/admin/ComplaintTable";
import CitizenLeaderboard from "../../components/admin/CitizenLeaderboard";
import RewardCard from "../../components/admin/RewardCard";
import BeforeAfterCard from "../../components/admin/BeforeAfterCard";
import ActivityTimeline from "../../components/admin/ActivityTimeline";
import { kpis, beforeAfterGallery } from "../../data/dummyData";

function QuickActions() {
  const actions = [
    { label: "Add Officer", icon: "➕" },
    { label: "Generate Report", icon: "📄" },
    { label: "Export Complaints", icon: "⬇️" },
    { label: "View Analytics", icon: "📈" },
    { label: "Manage Rewards", icon: "🏅" },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Quick Actions</h3>
      <div className="flex flex-wrap gap-3">
        {actions.map((a) => (
          <button
            key={a.label}
            className="flex items-center gap-2 text-sm border border-gray-200 rounded-md px-4 py-2 hover:bg-gray-50 text-gray-700"
          >
            <span>{a.icon}</span>
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="p-6 space-y-6">
          {/* KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {kpis.map((kpi) => (
              <StatusCard key={kpi.label} {...kpi} />
            ))}
          </div>

          {/* Analytics */}
          <AnalyticsCharts />

          {/* Complaint timeline + Rewards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ComplaintTable />
            </div>
            <RewardCard />
          </div>

          {/* Leaderboard + Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CitizenLeaderboard />
            <ActivityTimeline />
          </div>

          {/* Before/After gallery */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Before & After Resolution Gallery
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {beforeAfterGallery.map((item) => (
                <BeforeAfterCard key={item.title} item={item} />
              ))}
            </div>
          </div>

          <QuickActions />
        </main>
      </div>
    </div>
  );
}