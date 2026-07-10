export default function Landing() {
  return (
    <div className="flex-1 bg-slate-50">
      <section className="max-w-4xl mx-auto text-center py-20 px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          Report Civic Issues in Seconds
        </h1>
        <p className="text-slate-600 mb-8">
          Text, voice, or photo — Nagarik360 routes your complaint to the
          right department automatically.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-800">
            Report Issue
          </button>
          <button className="border border-slate-400 text-slate-700 px-6 py-2 rounded-md hover:bg-slate-100">
            Track Complaint
          </button>
        </div>
      </section>

      <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-20">
        {["Speak Complaint", "Upload Photo", "GPS Auto-Detect"].map((item) => (
          <div
            key={item}
            className="border border-slate-200 bg-white rounded-md p-6 text-center"
          >
            <h3 className="font-medium text-slate-800">{item}</h3>
          </div>
        ))}
      </section>
    </div>
  );
}