const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Roads & Infrastructure',
        'Water Supply',
        'Electricity',
        'Sanitation',
        'Public Safety',
        'Healthcare',
        'Education',
        'Transportation',
        'Environment',
        'Housing',
        'Tax & Revenue',
        'Other',
        'Pothole',
        'Garbage',
        'WaterLeakage',
        'StreetLight',
        'Flooding',
        'IllegalDumping',
        'NoisePollution',
        'Drainage',
        'Electrical',
      ],
    },
    subcategory: {
      type: String,
      default: '',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: [
        'pending',
        'under_review',
        'in_progress',
        'resolved',
        'rejected',
        'closed',
      ],
      default: 'pending',
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: [true, 'Location coordinates are required'],
      },
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
    media: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
        type: { type: String, enum: ['image', 'audio', 'video'], default: 'image' },
      },
    ],
    aiClassification: {
      summary: { type: String, default: '' },
      category: { type: String, default: '' },
      priority: { type: String, default: '' },
      sentiment: { type: String, default: '' },
      confidence: { type: Number, default: 0 },
      // Nagarik360 scoring fields
      safety_score: { type: Number, default: 0 },
      severity_score: { type: Number, default: 0 },
      time_sensitivity_score: { type: Number, default: 0 },
      detected_keywords: { type: [String], default: [] },
      nagrik_department: { type: String, default: '' },
    },
    isDuplicate: {
      type: Boolean,
      default: false,
    },
    duplicateOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
    },
    resolution: {
      description: { type: String, default: '' },
      resolvedAt: { type: Date },
      resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String, default: '' },
      submittedAt: { type: Date },
    },
    timeline: [
      {
        status: { type: String },
        remark: { type: String },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    upvoteCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for geospatial queries
complaintSchema.index({ 'location': '2dsphere' });

// Index for duplicate detection
complaintSchema.index({ title: 'text', description: 'text' });

// Index for status and department queries
complaintSchema.index({ status: 1, department: 1 });
complaintSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Complaint', complaintSchema);