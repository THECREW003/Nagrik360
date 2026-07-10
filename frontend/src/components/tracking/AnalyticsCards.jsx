import { motion } from "framer-motion";
import { Clock, TrendingUp, BarChart3, CheckCircle2 } from "lucide-react";

const cards = [
  { label: "Resolution Time", value: "3.2 days", icon: Clock },
  { label: "Current Stage", value: "Repair 70%", icon: BarChart3 },
  { label: "Dept. Avg Resolution", value: "5.1 days", icon: TrendingUp },
  { label: "Complaints Solved", value: "976", icon: CheckCircle2 },
];

export default function AnalyticsCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <Icon size={16} className="text-blue-600 mb-2" />
            <p className="text-lg font-bold text-gray-800">{c.value}</p>
            <p className="text-[11px] text-gray-500">{c.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}