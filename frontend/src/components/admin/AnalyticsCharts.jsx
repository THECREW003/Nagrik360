import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  complaintsPerDay, complaintsByDepartment, complaintCategories, resolutionTrend,
} from "../../data/dummyData";

const COLORS = ["#2563eb", "#0ea5e9", "#6366f1", "#0891b2", "#7c3aed"];

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export default function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ChartCard title="Complaints Per Day">
        <LineChart data={complaintsPerDay}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="complaints" stroke="#2563eb" strokeWidth={2} />
        </LineChart>
      </ChartCard>

      <ChartCard title="Complaints By Department">
        <BarChart data={complaintsByDepartment}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="department" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartCard>

      <ChartCard title="Complaint Categories">
        <PieChart>
          <Pie
            data={complaintCategories}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
          >
            {complaintCategories.map((entry, i) => (
              <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ChartCard>

      <ChartCard title="Resolution Trend">
        <AreaChart data={resolutionTrend}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Area type="monotone" dataKey="rate" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} />
        </AreaChart>
      </ChartCard>
    </div>
  );
}