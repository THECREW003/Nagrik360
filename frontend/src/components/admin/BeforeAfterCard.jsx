export default function BeforeAfterCard({ item }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="grid grid-cols-2">
        <div className="relative">
          <img src={item.before} alt="Before" className="w-full h-32 object-cover" />
          <span className="absolute top-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded">
            BEFORE
          </span>
        </div>
        <div className="relative">
          <img src={item.after} alt="After" className="w-full h-32 object-cover" />
          <span className="absolute top-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded">
            AFTER
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-semibold text-gray-800">{item.title}</h4>
          {item.aiVerified && (
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
              AI Verified
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500">
          {item.department} · Resolved in {item.resolutionTime}
        </p>
      </div>
    </div>
  );
}