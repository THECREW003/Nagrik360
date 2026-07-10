import { useState, useRef } from "react";

export default function ComplaintForm() {
  const [recording, setRecording] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [description, setDescription] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Grievance submitted for processing. Reference number will be generated.");
  };

  return (
    <div
      className="flex-1 bg-gray-100 px-6 py-10"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white border-2 border-gray-400"
      >
        {/* Header */}
        <div className="bg-[#1e3a8a] text-white px-6 py-3 border-b-4 border-[#138808]">
          <h2 className="text-base font-bold">
            Grievance Registration Form
          </h2>
        </div>

        <div className="p-6">
          {/* Method 1: Voice */}
          <div className="border-2 border-gray-300 p-5 mb-5">
            <p className="text-sm font-bold text-[#0f172a] mb-3">
              Method 1: Voice Statement (Optional)
            </p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setRecording((r) => !r)}
                className={`px-5 py-2 font-bold border-2 text-sm ${
                  recording
                    ? "bg-red-700 border-red-900 text-white"
                    : "bg-gray-200 border-gray-400 text-gray-800"
                }`}
              >
                {recording ? "■ STOP RECORDING" : "● START RECORDING"}
              </button>
              <span className="text-xs text-gray-600">
                {recording ? "Recording in progress..." : "No recording made"}
              </span>
            </div>
          </div>

          {/* Method 2: Photo */}
          <div className="border-2 border-gray-300 p-5 mb-5">
            <p className="text-sm font-bold text-[#0f172a] mb-3">
              Method 2: Photograph Upload (Optional)
            </p>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-400 bg-gray-50 py-6 text-center cursor-pointer"
            >
              <p className="text-sm text-gray-700">
                Click to select a photograph
              </p>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG (Max 5 MB)</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {fileName && (
              <div className="mt-2 text-xs bg-gray-100 border border-gray-400 px-3 py-1.5 inline-block">
                File attached: {fileName}
              </div>
            )}
          </div>

          {/* Method 3: Text */}
          <div className="border-2 border-gray-300 p-5 mb-5">
            <p className="text-sm font-bold text-[#0f172a] mb-3">
              Method 3: Written Description (Mandatory)
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="State your grievance clearly, including location and nature of the issue..."
              className="w-full border-2 border-gray-400 px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a8a]"
            />
          </div>

          {/* GPS Disclaimer */}
          <div className="border-2 border-[#FF9933] bg-orange-50 p-4 mb-6 text-xs text-gray-800">
            <strong>Official Notice:</strong> Upon submission, your device's
            GPS coordinates will be automatically attached to this grievance
            for the purpose of accurate department assignment and site
            verification. False or misleading complaints are liable for
            action under applicable rules.
          </div>

          <button
            type="submit"
            className="w-full bg-[#138808] text-white font-bold py-3 border-2 border-[#0d5f05] hover:bg-[#0d5f05]"
          >
            SUBMIT GRIEVANCE
          </button>
        </div>
      </form>
    </div>
  );
}