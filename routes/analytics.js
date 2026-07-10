const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboardAnalytics,
  getMyStats,
  getDepartmentAnalytics,
  getUsers,
} = require('../controllers/analyticsController');

router.get('/dashboard', protect, authorize('admin'), getDashboardAnalytics);
router.get('/my-stats', protect, getMyStats);
router.get('/department', protect, authorize('admin', 'department_official'), getDepartmentAnalytics);
router.get('/users', protect, authorize('admin'), getUsers);

module.exports = router;