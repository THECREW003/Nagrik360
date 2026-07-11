const Reward = require('../models/Reward');
const User = require('../models/User');

// @desc    Get user rewards
// @route   GET /api/rewards
// @access  Private
const getRewards = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const query = { user: req.user._id };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [rewards, total, totalPoints] = await Promise.all([
      Reward.find(query)
        .populate('complaint', 'complaintId title')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      Reward.countDocuments(query),
      Reward.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: null, total: { $sum: '$points' } } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      count: rewards.length,
      total,
      totalPoints: totalPoints.length > 0 ? totalPoints[0].total : 0,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      rewards,
    });
  } catch (error) {
    console.error('GetRewards Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching rewards.',
    });
  }
};

// @desc    Get reward leaderboard
// @route   GET /api/rewards/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const leaderboard = await User.find({ isActive: true, role: 'citizen' })
      .sort('-rewardPoints')
      .limit(parseInt(limit))
      .select('name avatar rewardPoints complaintsCount resolvedCount');

    res.status(200).json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    console.error('GetLeaderboard Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching leaderboard.',
    });
  }
};

// @desc    Admin: Award points to user
// @route   POST /api/rewards/award
// @access  Private/Admin
const awardPoints = async (req, res) => {
  try {
    const { userId, points, title, description } = req.body;

    if (!userId || !points || !title) {
      return res.status(400).json({
        success: false,
        message: 'userId, points, and title are required.',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const reward = await Reward.create({
      user: userId,
      type: 'points',
      title,
      description: description || '',
      points,
      source: 'admin_awarded',
    });

    await User.findByIdAndUpdate(userId, {
      $inc: { rewardPoints: points },
    });

    // Create notification
    const Notification = require('../models/Notification');
    await Notification.create({
      user: userId,
      title: 'Reward Received!',
      message: `You earned ${points} points: ${title}`,
      type: 'reward_earned',
    });

    res.status(201).json({
      success: true,
      message: `${points} points awarded to ${user.name}.`,
      reward,
    });
  } catch (error) {
    console.error('AwardPoints Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error awarding points.',
    });
  }
};

// @desc    Get reward statistics
// @route   GET /api/rewards/stats
// @access  Private
const getRewardStats = async (req, res) => {
  try {
    const stats = await Reward.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$source',
          totalPoints: { $sum: '$points' },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalPoints: -1 } },
    ]);

    const user = await User.findById(req.user._id).select('rewardPoints complaintsCount resolvedCount');

    res.status(200).json({
      success: true,
      stats,
      user: {
        totalPoints: user.rewardPoints,
        complaintsCount: user.complaintsCount,
        resolvedCount: user.resolvedCount,
      },
    });
  } catch (error) {
    console.error('GetRewardStats Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching reward stats.',
    });
  }
};

module.exports = {
  getRewards,
  getLeaderboard,
  awardPoints,
  getRewardStats,
};