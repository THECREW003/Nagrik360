import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";

const stages = [
  "Complaint Submitted",
  "AI Verification",
  "Department Assigned",
  "Officer Accepted",
  "Inspection Completed",
  "Repair Started",
  "Repair 70% Complete",
  "Citizen Verification",
  "Resolved",
];

export default function StatusTimeline({ currentIndex = 6 }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-6">Status Timeline</h3>
      <div className="relative pl-2">
        {stages.map((stage, i) => {
          const isDone = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isFuture = i > currentIndex;

          return (
            <motion.div
              key={stage}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="relative flex items-start gap-3 pb-7 last:pb-0"
            >
              {i !== stages.length - 1 && (
                <span
                  className={`absolute left-[9px] top-6 w-0.5 h-full ${
                    isDone ? "bg-emerald-400" : "bg-gray-200"
                  }`}
                />
              )}

              <span className="relative z-10 mt-0.5">
                {isDone ? (
                  <CheckCircle2 size={20} className="text-emerald-500" />
                ) : isCurrent ? (
                  <span className="relative flex items-center justify-center">
                    <span className="absolute w-5 h-5 rounded-full bg-blue-400 opacity-60 animate-ping" />
                    <Circle size={20} className="relative text-blue-600 fill-blue-100" />
                  </span>
                ) : (
                  <Circle size={20} className="text-gray-300" />
                )}
              </span>

              <p
                className={`text-sm ${
                  isDone
                    ? "text-gray-700 font-medium"
                    : isCurrent
                    ? "text-blue-700 font-semibold"
                    : "text-gray-400"
                }`}
              >
                {stage}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}