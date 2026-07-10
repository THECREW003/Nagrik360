const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: [
        'complaint_submitted',
        'status_update',
        'complaint_resolved',
        'new_assignment',
        'reward_earned',
        'duplicate_found',
        'feedback_request',
        'system',
      ],
      default: 'system',
    },
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isImportant: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fetching user notifications
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);