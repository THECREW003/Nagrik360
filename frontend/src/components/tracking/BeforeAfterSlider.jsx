import { useState, useRef } from "react";
import { ImageOff } from "lucide-react";

export default function BeforeAfterSlider({ beforeSrc, afterSrc }) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef(null);
  const dragging = useRef(false);

  const updatePosition = (clientX) => {
    const rect = containerRef.current.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    setPosition(pct);
  };

  const handleMouseDown = () => (dragging.current = true);
  const handleMouseUp = () => (dragging.current = false);
  const handleMouseMove = (e) => {
    if (dragging.current) updatePosition(e.clientX);
  };
  const handleTouchMove = (e) => {
    if (e.touches[0]) updatePosition(e.touches[0].clientX);
  };

  const Placeholder = ({ label }) => (
    <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-400">
      <ImageOff size={28} />
      <span className="text-xs mt-2">{label} image not available</span>
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Before vs After</h3>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        className="relative w-full h-64 rounded-lg overflow-hidden select-none cursor-ew-resize"
      >
        <div className="absolute inset-0">
          {afterSrc ? (
            <img src={afterSrc} alt="After" className="w-full h-full object-cover" />
          ) : (
            <Placeholder label="After" />
          )}
        </div>

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          {beforeSrc ? (
            <img
              src={beforeSrc}
              alt="Before"
              className="h-full object-cover"
              style={{ width: containerRef.current?.offsetWidth || "100%" }}
            />
          ) : (
            <div style={{ width: containerRef.current?.offsetWidth || "100%" }} className="h-full">
              <Placeholder label="Before" />
            </div>
          )}
        </div>

        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          className="absolute top-0 bottom-0 w-1 bg-white shadow-md cursor-ew-resize flex items-center justify-center"
          style={{ left: `${position}%` }}
        >
          <div className="w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-[10px] font-bold text-gray-600 -ml-3">
            ↔
          </div>
        </div>

        <span className="absolute top-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded">
          BEFORE
        </span>
        <span className="absolute top-2 right-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded">
          AFTER
        </span>
      </div>
    </div>
  );
}