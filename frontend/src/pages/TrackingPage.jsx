import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ComplaintHeader from "../components/tracking/ComplaintHeader";
import StatusTimeline from "../components/tracking/StatusTimeline";
import ProgressCircle from "../components/tracking/ProgressCircle";
import ActivityFeed from "../components/tracking/ActivityFeed";
import DepartmentJourney from "../components/tracking/DepartmentJourney";
import AIPredictionCard from "../components/tracking/AIPredictionCard";
import RewardCard from "../components/tracking/RewardCard";
import CitizenFeedback from "../components/tracking/CitizenFeedback";
import AnalyticsCards from "../components/tracking/AnalyticsCards";

export default function TrackingPage() {
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  
  const [complaint, setComplaint] = useState({
    id: "NGR2041",
    title: "Pothole near ZP High School",
    status: "In Progress",
    priority: "Urgent",
    eta: "2 days",
    department: "Roads Department",
    officer: "R. Kumar",
    location: "Uppal, Hyderabad (17.4089° N, 78.5562° E)",
  });

  const [activities, setActivities] = useState([
    { type: "submitted", title: "Complaint submitted by citizen", time: "3 days ago" },
    { type: "verified", title: "AI verified as Pothole, Urgent priority", time: "2 days 22 hrs ago" },
    { type: "assigned", title: "Assigned to R. Kumar, Roads Department", time: "2 days ago" },
    { type: "photo", title: "Site inspection photo uploaded", time: "1 day ago" },
    { type: "resolved", title: "Repair work 70% complete", time: "4 hrs ago" },
  ]);

  const [progressPercentage, setProgressPercentage] = useState(70);

  useEffect(() => {
    const initializeTracking = (liveLat = null, liveLng = null) => {
      try {
        const targetId = searchParams.get("id");
        const localRecords = localStorage.getItem("myComplaints");
        
        if (localRecords) {
          const runningComplaints = JSON.parse(localRecords);
          const foundComplaint = targetId 
            ? runningComplaints.find(c => c.ticket === targetId)
            : runningComplaints[0];

          if (foundComplaint) {
            let gpsLabel = "Secunderabad Grid Area";
            if (foundComplaint.latitude && foundComplaint.longitude) {
              gpsLabel = `${foundComplaint.latitude}° N, ${foundComplaint.longitude}° E`;
            } else if (liveLat && liveLng) {
              gpsLabel = `${liveLat}° N, ${liveLng}° E`;
            }

            const normalizedStatus = foundComplaint.status === "Submitted" ? "In Progress" : foundComplaint.status;

            setComplaint({
              id: foundComplaint.ticket || "NGR2041",
              title: foundComplaint.subject ? (foundComplaint.subject.length > 35 ? foundComplaint.subject.substring(0, 35) + "..." : foundComplaint.subject) : "Road Infrastructure Issue",
              status: normalizedStatus || "In Progress",
              priority: foundComplaint.priority || "Medium",
              eta: "2 days",
              department: foundComplaint.department || "Roads Department",
              officer: "R. Kumar",
              location: `Hyderabad (${gpsLabel})`,
            });

            setActivities([
              { type: "submitted", title: `Complaint pinned to geo-coordinates [${gpsLabel}]`, time: "Just now" },
              { type: "verified", title: "AI Computer Vision scanning surface structural integrity", time: "1 min ago" },
              { type: "assigned", title: "Dispatched to regional supervisor R. Kumar", time: "1 min ago" }
            ]);
            setProgressPercentage(35);
          }
        }
      } catch (err) {
        console.error("Tracking setup error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          initializeTracking(
            position.coords.latitude.toFixed(4),
            position.coords.longitude.toFixed(4)
          );
        },
        (error) => {
          console.warn("Live tracking geolocation skipped:", error.message);
          initializeTracking();
        },
        { enableHighAccuracy: true, timeout: 4000 }
      );
    } else {
      initializeTracking();
    }
  }, [searchParams]);

  const prediction = {
    eta: "2 days",
    confidence: 89,
    reason: `Based on localized parameters near coordinates ${complaint.location}.`,
  };

  const pageBackgroundStyle = {
    fontFamily: "sans-serif",
    backgroundImage: `
      linear-gradient(to bottom, rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.92)),
      url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80')
    `,
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-cover bg-center bg-fixed px-6 py-10 flex items-center" style={pageBackgroundStyle}>
        <div className="max-w-5xl mx-auto w-full space-y-6 animate-pulse">
          <div className="h-32 bg-white/10 backdrop-blur-md rounded-xl border border-white/10" />
          <div className="h-64 bg-white/10 backdrop-blur-md rounded-xl border border-white/10" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-cover bg-center bg-fixed px-4 md:px-6 py-10" style={pageBackgroundStyle}>
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-white/20 overflow-hidden">
          <ComplaintHeader complaint={complaint} />
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-xl p-2 shadow-xl border border-white/20">
          <AnalyticsCards />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white/95 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-xl border border-white/20 flex flex-col justify-center">
            <StatusTimeline currentIndex={3} />
          </div>
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20 flex items-center justify-center">
            <ProgressCircle percentage={progressPercentage} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20">
            <ActivityFeed activities={activities} />
          </div>
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20">
            <DepartmentJourney currentIndex={2} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-5 shadow-xl border border-white/20">
            <AIPredictionCard prediction={prediction} />
          </div>
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-5 shadow-xl border border-white/20">
            <RewardCard points={250} badge="Community Hero" progress={60} />
          </div>
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-5 shadow-xl border border-white/20">
            <CitizenFeedback />
          </div>
        </div>
        
      </div>
    </div>
  );
}