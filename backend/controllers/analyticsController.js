const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Department = require('../models/Department');

const getDashboardAnalytics = async (req, res) => {
  try {
    const [totalComplaints, totalUsers, totalDepartments, statusCounts, categoryCounts, priorityCounts, recentComplaints, monthlyTrend] = await Promise.all([
      Complaint.countDocuments(),
      User.countDocuments({ isActive: true }),
      Department.countDocuments({ isActive: true }),
      Complaint.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Complaint.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Complaint.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]),
      Complaint.find()
        .populate('user', 'name email avatar')
        .populate('department', 'name code')
        .sort('-createdAt')
        .limit(5),
      Complaint.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 }
      ])
    ]);

    const resolvedCount = statusCounts.find((s) => s._id === 'resolved')?.count || 0;
    const resolutionRate = totalComplaints > 0
      ? ((resolvedCount / totalComplaints) * 100).toFixed(1)
      : 0;

    const statusMap = {};
    statusCounts.forEach((s) => {
      statusMap[s._id] = s.count;
    });

    const priorityMap = {};
    priorityCounts.forEach((p) => {
      priorityMap[p._id] = p.count;
    });

    const trend = monthlyTrend.map((t) => ({
      month: `${t._id.year}-${String(t._id.month).padStart(2, '0')}`,
      count: t.count
    }));

    res.status(200).json({
      success: true,
      analytics: {
        overview: {
          totalComplaints,
          totalUsers,
          totalDepartments,
          resolutionRate: parseFloat(resolutionRate),
          resolvedCount,
          pendingCount: statusMap['pending'] || 0,
          inProgressCount: statusMap['in_progress'] || 0,
          underReviewCount: statusMap['under_review'] || 0
        },
        statusBreakdown: statusMap,
        categoryBreakdown: categoryCounts.map((c) => ({
          category: c._id,
          count: c.count
        })),
        priorityBreakdown: priorityMap,
        recentComplaints,
        monthlyTrend: trend
      }
    });
  } catch (error) {
    console.error('GetDashboardAnalytics Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching analytics.'
    });
  }
};

const getMyStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [complaintStats, monthlyActivity, categoryBreakdown, recentActivity] = await Promise.all([
      Complaint.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Complaint.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 }
      ]),
      Complaint.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Complaint.find({ user: userId })
        .select('complaintId title status category createdAt')
        .sort('-createdAt')
        .limit(5)
    ]);

    const statusMap = {};
    complaintStats.forEach((s) => {
      statusMap[s._id] = s.count;
    });

    const user = await User.findById(userId).select('rewardPoints complaintsCount resolvedCount');

    res.status(200).json({
      success: true,
      stats: {
        totalComplaints: user.complaintsCount,
        resolvedComplaints: user.resolvedCount,
        pendingComplaints: statusMap['pending'] || 0,
        inProgressComplaints: statusMap['in_progress'] || 0,
        rewardPoints: user.rewardPoints,
        statusBreakdown: statusMap,
        categoryBreakdown: categoryBreakdown.map((c) => ({
          category: c._id,
          count: c.count
        })),
        monthlyActivity: monthlyActivity.map((m) => ({
          month: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`,
          count: m.count
        })),
        recentActivity
      }
    });
  } catch (error) {
    console.error('GetMyStats Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching stats.'
    });
  }
};

const getDepartmentAnalytics = async (req, res) => {
  try {
    const departmentId = req.user.department;

    if (!departmentId && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'No department assigned to your account.'
      });
    }

    const matchQuery = {};
    if (req.user.role !== 'admin') {
      matchQuery.department = departmentId;
    } else if (req.query.departmentId) {
      matchQuery.department = req.query.departmentId;
    }

    const [totalComplaints, statusCounts, priorityCounts, officials, avgResolutionTime] = await Promise.all([
      Complaint.countDocuments(matchQuery),
      Complaint.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Complaint.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]),
      User.countDocuments({ department: departmentId, role: 'department_official', isActive: true }),
      Complaint.aggregate([
        { $match: { ...matchQuery, status: 'resolved', 'resolution.resolvedAt': { $ne: null } } },
        {
          $project: {
            resolutionTime: {
              $divide: [
                { $subtract: ['$resolution.resolvedAt', '$createdAt'] },
                3600000
              ]
            }
          }
        },
        { $group: { _id: null, avgTime: { $avg: '$resolutionTime' } } }
      ])
    ]);

    const statusMap = {};
    statusCounts.forEach((s) => {
      statusMap[s._id] = s.count;
    });

    const priorityMap = {};
    priorityCounts.forEach((p) => {
      priorityMap[p._id] = p.count;
    });

    res.status(200).json({
      success: true,
      analytics: {
        totalComplaints,
        totalOfficials: officials,
        avgResolutionHours: avgResolutionTime.length > 0
          ? Math.round(avgResolutionTime[0].avgTime * 10) / 10
          : 0,
        statusBreakdown: statusMap,
        priorityBreakdown: priorityMap
      }
    });
  } catch (error) {
    console.error('GetDepartmentAnalytics Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching department analytics.'
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(query)
        .populate('department', 'name code')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit))
        .select('-password'),
      User.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      users
    });
  } catch (error) {
    console.error('GetUsers Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users.'
    });
  }
};

module.exports = {
  getDashboardAnalytics,
  getMyStats,
  getDepartmentAnalytics,
  getUsers
};