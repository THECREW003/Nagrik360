import { motion } from "framer-motion";
import { MapPin, User, Clock, Building2 } from "lucide-react";

export default function ComplaintHeader({ complaint }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-xs font-mono text-gray-400 mb-1">
            #{complaint.id}
          </p>
          <h1 className="text-xl font-bold text-gray-900">{complaint.title}</h1>
        </div>
        <span className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full">
          {complaint.status}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              complaint.priority === "Urgent" ? "bg-red-500" : "bg-gray-400"
            }`}
          />
          <div>
            <p className="text-[11px] text-gray-400">Priority</p>
            <p className="text-sm font-medium text-gray-800">{complaint.priority}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-400" />
          <div>
            <p className="text-[11px] text-gray-400">ETA</p>
            <p className="text-sm font-medium text-gray-800">{complaint.eta}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Building2 size={16} className="text-gray-400" />
          <div>
            <p className="text-[11px] text-gray-400">Department</p>
            <p className="text-sm font-medium text-gray-800">{complaint.department}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <User size={16} className="text-gray-400" />
          <div>
            <p className="text-[11px] text-gray-400">Officer</p>
            <p className="text-sm font-medium text-gray-800">{complaint.officer}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-4 text-xs text-gray-400">
        <MapPin size={13} />
        {complaint.location}
      </div>
    </motion.div>
  );
}