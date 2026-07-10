import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function AIPredictionCard({ prediction }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-xl p-6 overflow-hidden border border-white/40 shadow-sm"
      style={{
        background: "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(99,102,241,0.08))",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={16} className="text-blue-600" />
        <h3 className="text-sm font-semibold text-gray-700">Prediction</h3>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-[11px] text-gray-500">Estimated Completion</p>
          <p className="text-lg font-bold text-gray-800">{prediction.eta}</p>
        </div>
        <div>
          <p className="text-[11px] text-gray-500">Confidence</p>
          <div className="w-full bg-white/50 rounded-full h-2 mt-1">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${prediction.confidence}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1">{prediction.confidence}%</p>
        </div>
        <div>
          <p className="text-[11px] text-gray-500">Reason</p>
          <p className="text-xs text-gray-600 mt-1">{prediction.reason}</p>
        </div>
      </div>
    </motion.div>
  );
}