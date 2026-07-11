const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getRewards,
  getLeaderboard,
  awardPoints,
  getRewardStats,
} = require('../controllers/rewardController');

router.get('/leaderboard', protect, getLeaderboard);
router.get('/stats', protect, getRewardStats);
router.get('/', protect, getRewards);
router.post('/award', protect, authorize('admin'), awardPoints);

module.exports = router;