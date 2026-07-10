import { motion } from "framer-motion";
import { GitCommit, CheckCircle2, UserCheck, Camera, Sparkles } from "lucide-react";

const iconMap = {
  submitted: GitCommit,
  verified: Sparkles,
  assigned: UserCheck,
  photo: Camera,
  resolved: CheckCircle2,
};

export default function ActivityFeed({ activities }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-5">Officer Activity</h3>
      <div className="relative pl-2">
        {activities.map((a, i) => {
          const Icon = iconMap[a.type] || GitCommit;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative flex gap-3 pb-6 last:pb-0"
            >
              {i !== activities.length - 1 && (
                <span className="absolute left-[13px] top-7 w-px h-full bg-gray-200" />
              )}
              <span className="relative z-10 w-7 h-7 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                <Icon size={13} className="text-gray-600" />
              </span>
              <div>
                <p className="text-sm text-gray-800 font-medium">{a.title}</p>
                <p className="text-xs text-gray-400">{a.time}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}