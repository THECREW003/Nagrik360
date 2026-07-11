Server-side Pagination & Analytics API Examples

This document shows example requests to use server-side pagination and analytics endpoints in the Nagrik360 backend.

1) Complaints list (server-side pagination & filters)

Endpoint: GET /api/complaints
Query params:
- page (default 1)
- limit (default 10)
- search (optional) - matches title, description, complaintId
- status, category, priority, department (optional)
- startDate, endDate (ISO date strings)

Example:

GET /api/complaints?page=2&limit=25&search=NGR-000&status=pending

Response shape (200):
{
  success: true,
  count: <number of items returned>,
  total: <total matching items>,
  totalPages: <total pages>,
  currentPage: <current page number>,
  complaints: [ ... ]
}

2) Analytics dashboard

Endpoint: GET /api/analytics/dashboard
Requires: protected route (admin)

Response includes:
- analytics.overview (totalComplaints, resolutionRate, pendingCount, inProgressCount, ...)
- analytics.statusBreakdown (counts per status)
- analytics.categoryBreakdown (top categories)
- analytics.priorityBreakdown
- analytics.recentComplaints (array of recent complaint objects)
- analytics.monthlyTrend (monthly counts)

Example usage on frontend:
- Fetch `/api/analytics/dashboard` and map `analytics.categoryBreakdown` to chart labels/data.
- Use `analytics.recentComplaints` for a recent activity list.

Notes:
- Complaints endpoint applies role-based filtering: citizens see only their complaints; department officials see department complaints; admins see all.
- Adjust `page` and `limit` to control server-side pagination for large datasets.
