export default function ComplaintForm() {
  return (
    <div className="flex-1 bg-slate-50 px-6 py-10">
      <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-md p-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">
          Report an Issue
        </h2>

        <div className="flex gap-3 mb-6">
          <button className="flex-1 border border-slate-300 rounded-md py-2 text-sm hover:bg-slate-100">
            📍 Report Issue
          </button>
          <button className="flex-1 border border-slate-300 rounded-md py-2 text-sm hover:bg-slate-100">
            🎤 Speak
          </button>
          <button className="flex-1 border border-slate-300 rounded-md py-2 text-sm hover:bg-slate-100">
            📷 Photo
          </button>
        </div>

        <textarea
          placeholder="Describe the issue..."
          rows={4}
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        <p className="text-xs text-slate-500 mb-4">
          📍 Location will be captured automatically
        </p>

        <button className="w-full bg-blue-700 text-white rounded-md py-2 text-sm font-medium hover:bg-blue-800">
          Submit Complaint
        </button>
      </div>
    </div>
  );
}