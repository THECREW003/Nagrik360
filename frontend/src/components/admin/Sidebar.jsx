import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: "📊", to: "/admin" },
  { label: "Complaints", icon: "📋", to: "/admin/complaints" },
  { label: "Analytics", icon: "📈", to: "/admin/analytics" },
  { label: "Citizens", icon: "👥", to: "/admin/citizens" },
  { label: "Rewards", icon: "🏅", to: "/admin/rewards" },
  { label: "Departments", icon: "🏢", to: "/admin/departments" },
  { label: "Reports", icon: "📄", to: "/admin/reports" },
  { label: "Settings", icon: "⚙️", to: "/admin/settings" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-60 bg-white border-r border-gray-200 hidden md:flex flex-col shrink-0">
      <div className="px-5 py-5 border-b border-gray-200">
        <span className="text-lg font-bold text-gray-800">Nagarik360</span>
        <p className="text-xs text-gray-400">Admin Console</p>
      </div>
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm ${
                isActive
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}