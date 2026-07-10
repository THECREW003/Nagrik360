const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    type: {
      type: String,
      enum: ['points', 'badge', 'certificate', 'recognition', 'other'],
      default: 'points',
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    points: {
      type: Number,
      default: 0,
    },
    badge: {
      name: { type: String },
      icon: { type: String },
      color: { type: String },
    },
    source: {
      type: String,
      enum: [
        'complaint_submitted',
        'complaint_resolved',
        'feedback_given',
        'upvote_received',
        'community_contribution',
        'admin_awarded',
      ],
      default: 'complaint_submitted',
    },
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
    },
    isRedeemed: {
      type: Boolean,
      default: false,
    },
    redeemedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

rewardSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Reward', rewardSchema);