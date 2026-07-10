import { motion } from "framer-motion";
import { User, Building2, HardHat, Wrench, CheckCircle2 } from "lucide-react";

const journey = [
  { label: "Citizen", icon: User },
  { label: "Ward Office", icon: Building2 },
  { label: "Road Department", icon: Building2 },
  { label: "Assistant Engineer", icon: HardHat },
  { label: "Contractor", icon: Wrench },
  { label: "Completed", icon: CheckCircle2 },
];

export default function DepartmentJourney({ currentIndex = 3 }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-5">Department Journey</h3>
      <div className="flex flex-col">
        {journey.map((step, i) => {
          const Icon = step.icon;
          const isDone = i <= currentIndex;
          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3"
            >
              <div className="flex flex-col items-center">
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    isDone ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Icon size={16} />
                </span>
                {i !== journey.length - 1 && (
                  <span
                    className={`w-0.5 h-8 ${isDone ? "bg-blue-300" : "bg-gray-200"}`}
                  />
                )}
              </div>
              <span
                className={`text-sm pb-8 ${
                  isDone ? "text-gray-800 font-medium" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}