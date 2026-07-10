const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Department code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    headOfficial: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    officials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    categories: [
      {
        type: String,
      },
    ],
    contactEmail: {
      type: String,
      default: '',
    },
    contactPhone: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    complaintsAssigned: {
      type: Number,
      default: 0,
    },
    complaintsResolved: {
      type: Number,
      default: 0,
    },
    avgResolutionTime: {
      type: Number, // in hours
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Department', departmentSchema);