import { useState, useEffect } from "react";
import ComplaintHeader from "../components/tracking/ComplaintHeader";
import StatusTimeline from "../components/tracking/StatusTimeline";
import ProgressCircle from "../components/tracking/ProgressCircle";
import BeforeAfterSlider from "../components/tracking/BeforeAfterSlider";
import ActivityFeed from "../components/tracking/ActivityFeed";
import DepartmentJourney from "../components/tracking/DepartmentJourney";
import AIPredictionCard from "../components/tracking/AIPredictionCard";
import RewardCard from "../components/tracking/RewardCard";
import CitizenFeedback from "../components/tracking/CitizenFeedback";
import AnalyticsCards from "../components/tracking/AnalyticsCards";

const complaint = {
  id: "NGR2041",
  title: "Pothole near ZP High School",
  status: "In Progress",
  priority: "Urgent",
  eta: "2 days",
  department: "Roads Department",
  officer: "R. Kumar",
  location: "Uppal, Hyderabad",
};

const activities = [
  { type: "submitted", title: "Complaint submitted by citizen", time: "3 days ago" },
  { type: "verified", title: "AI verified as Pothole, Urgent priority", time: "2 days 22 hrs ago" },
  { type: "assigned", title: "Assigned to R. Kumar, Roads Department", time: "2 days ago" },
  { type: "photo", title: "Site inspection photo uploaded", time: "1 day ago" },
  { type: "resolved", title: "Repair work 70% complete", time: "4 hrs ago" },
];

const prediction = {
  eta: "2 days",
  confidence: 84,
  reason: "Based on similar pothole repairs completed by this department in the last 30 days.",
};

export default function TrackingPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 px-6 py-10">
        <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
          <div className="h-32 bg-gray-200 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-80 bg-gray-200 rounded-xl" />
            <div className="h-80 bg-gray-200 rounded-xl" />
          </div>
          <div className="h-40 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 px-4 md:px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <ComplaintHeader complaint={complaint} />

        <AnalyticsCards />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <StatusTimeline currentIndex={6} />
          </div>
          <ProgressCircle percentage={70} />
        </div>

        <BeforeAfterSlider beforeSrc={null} afterSrc={null} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ActivityFeed activities={activities} />
          <DepartmentJourney currentIndex={3} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AIPredictionCard prediction={prediction} />
          <RewardCard points={250} badge="Community Hero" progress={60} />
          <CitizenFeedback />
        </div>
      </div>
    </div>
  );
}