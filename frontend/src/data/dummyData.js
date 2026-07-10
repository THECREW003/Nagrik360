// Centralized dummy data for the admin dashboard.
// Replace each export with a real API call once the backend is ready.

export const kpis = [
  { label: "Total Complaints", value: "1,284", trend: "+8.2%", trendUp: true, icon: "📋", color: "border-blue-500" },
  { label: "Complaints Resolved", value: "976", trend: "+5.1%", trendUp: true, icon: "✅", color: "border-emerald-500" },
  { label: "Pending Complaints", value: "308", trend: "-2.4%", trendUp: false, icon: "⏳", color: "border-amber-500" },
  { label: "Resolution Rate", value: "76%", trend: "+3.0%", trendUp: true, icon: "📈", color: "border-indigo-500" },
  { label: "Active Citizens", value: "4,532", trend: "+12.6%", trendUp: true, icon: "👥", color: "border-cyan-500" },
  { label: "AI Verified Reports", value: "812", trend: "+9.7%", trendUp: true, icon: "🛡️", color: "border-purple-500" },
];

export const complaintsPerDay = [
  { day: "Mon", complaints: 42 },
  { day: "Tue", complaints: 55 },
  { day: "Wed", complaints: 48 },
  { day: "Thu", complaints: 61 },
  { day: "Fri", complaints: 70 },
  { day: "Sat", complaints: 38 },
  { day: "Sun", complaints: 29 },
];

export const complaintsByDepartment = [
  { department: "Roads", count: 320 },
  { department: "Sanitation", count: 275 },
  { department: "Water", count: 210 },
  { department: "Electricity", count: 180 },
  { department: "Others", count: 299 },
];

export const complaintCategories = [
  { name: "Pothole", value: 400 },
  { name: "Garbage", value: 300 },
  { name: "Streetlight", value: 200 },
  { name: "Water Leak", value: 180 },
  { name: "Flooding", value: 120 },
];

export const resolutionTrend = [
  { month: "Jan", rate: 62 },
  { month: "Feb", rate: 65 },
  { month: "Mar", rate: 68 },
  { month: "Apr", rate: 70 },
  { month: "May", rate: 74 },
  { month: "Jun", rate: 76 },
];

export const complaints = [
  { id: "NGR2041", citizen: "Rahul Sharma", department: "Roads", status: "In Progress", priority: "Urgent", officer: "R. Kumar", time: "2 hrs ago" },
  { id: "NGR2040", citizen: "Anita Reddy", department: "Sanitation", status: "Resolved", priority: "Normal", officer: "S. Rao", time: "5 hrs ago" },
  { id: "NGR2039", citizen: "Vikram Singh", department: "Water", status: "Assigned", priority: "Urgent", officer: "P. Nair", time: "1 day ago" },
  { id: "NGR2038", citizen: "Priya Menon", department: "Electricity", status: "Under Review", priority: "Normal", officer: "Unassigned", time: "1 day ago" },
  { id: "NGR2037", citizen: "Karan Mehta", department: "Roads", status: "Resolved", priority: "Normal", officer: "R. Kumar", time: "2 days ago" },
];

export const citizens = [
  { name: "Anita Reddy", submitted: 24, resolved: 21, points: 620, likes: 142, comments: 38, shares: 12, rank: 1 },
  { name: "Rahul Sharma", submitted: 19, resolved: 15, points: 540, likes: 98, comments: 21, shares: 9, rank: 2 },
  { name: "Vikram Singh", submitted: 17, resolved: 14, points: 505, likes: 87, comments: 19, shares: 7, rank: 3 },
  { name: "Priya Menon", submitted: 15, resolved: 12, points: 460, likes: 74, comments: 15, shares: 6, rank: 4 },
  { name: "Karan Mehta", submitted: 12, resolved: 10, points: 390, likes: 60, comments: 11, shares: 4, rank: 5 },
];

export const rewards = {
  totalPoints: 24680,
  badgesEarned: 312,
  rewardsDistributed: 145,
};

export const beforeAfterGallery = [
  {
    title: "Pothole near ZP High School",
    department: "Roads",
    resolutionTime: "2 days",
    aiVerified: true,
    before: "https://images.unsplash.com/photo-1584448097639-99f8f0d5c9b8?w=400",
    after: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400",
  },
  {
    title: "Overflowing garbage bin, Ameerpet",
    department: "Sanitation",
    resolutionTime: "1 day",
    aiVerified: true,
    before: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=400",
    after: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400",
  },
];

export const activities = [
  { type: "Complaint Submitted", detail: "NGR2041 by Rahul Sharma", time: "2 hrs ago" },
  { type: "Officer Assigned", detail: "R. Kumar assigned to NGR2041", time: "1 hr 40 min ago" },
  { type: "AI Verified", detail: "NGR2039 classified as Water Leak, Urgent", time: "1 hr ago" },
  { type: "Before Image Uploaded", detail: "NGR2038 site photo attached", time: "45 min ago" },
  { type: "Complaint Closed", detail: "NGR2037 marked Resolved", time: "20 min ago" },
  { type: "Reward Points Credited", detail: "+20 points to Karan Mehta", time: "10 min ago" },
];