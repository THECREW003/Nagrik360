import { complaints } from "../../data/dummyData";

const statusStyles = {
  Resolved: "bg-emerald-50 text-emerald-700",
  "In Progress": "bg-blue-50 text-blue-700",
  Assigned: "bg-gray-100 text-gray-700",
  "Under Review": "bg-amber-50 text-amber-700",
};

const priorityStyles = {
  Urgent: "bg-red-50 text-red-600",
  Normal: "bg-gray-100 text-gray-600",
};

export default function ComplaintTable() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
      <div className="px-5 py-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">Recent Complaints</h3>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
            <th className="px-5 py-3">Complaint ID</th>
            <th className="px-5 py-3">Citizen</th>
            <th className="px-5 py-3">Department</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3">Priority</th>
            <th className="px-5 py-3">Officer</th>
            <th className="px-5 py-3">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {complaints.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="px-5 py-3 font-mono text-xs text-blue-700">#{c.id}</td>
              <td className="px-5 py-3 text-gray-800">{c.citizen}</td>
              <td className="px-5 py-3 text-gray-600">{c.department}</td>
              <td className="px-5 py-3">
                <span className={`text-xs px-2.5 py-1 rounded-full ${statusStyles[c.status]}`}>
                  {c.status}
                </span>
              </td>
              <td className="px-5 py-3">
                <span className={`text-xs px-2.5 py-1 rounded-full ${priorityStyles[c.priority]}`}>
                  {c.priority}
                </span>
              </td>
              <td className="px-5 py-3 text-gray-600">{c.officer}</td>
              <td className="px-5 py-3 text-gray-400 text-xs">{c.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}