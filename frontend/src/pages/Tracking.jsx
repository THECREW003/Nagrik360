const steps = ["Submitted", "Under Review", "Assigned", "In Progress", "Resolved"];

export default function Tracking() {
  const currentStep = 2; // will be dynamic later

  return (
    <div className="flex-1 bg-slate-50 px-6 py-10">
      <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-md p-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-1">
          Complaint #NGR2034
        </h2>
        <p className="text-sm text-slate-500 mb-6">Pothole — Roads Department</p>

        <div className="flex justify-between items-center">
          {steps.map((step, i) => (
            <div key={step} className="flex-1 flex flex-col items-center text-center">
              <div
                className={`w-6 h-6 rounded-full mb-2 ${
                  i <= currentStep ? "bg-blue-700" : "bg-slate-300"
                }`}
              />
              <span className="text-xs text-slate-600">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}