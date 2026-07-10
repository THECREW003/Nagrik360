const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const {
  createComplaint,
  getComplaints,
  getComplaint,
  updateStatus,
  assignComplaint,
  upvoteComplaint,
  submitFeedback,
  checkDuplicate,
  getNearbyComplaints,
} = require('../controllers/complaintController');

// Validation rules
const complaintValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5 })
    .withMessage('Title must be at least 5 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
];

// Routes
router.get('/nearby', protect, getNearbyComplaints);
router.post('/check-duplicate', protect, checkDuplicate);
router.get('/', protect, getComplaints);
router.post('/', protect, upload.array('media', 5), complaintValidation, createComplaint);
router.get('/:id', protect, getComplaint);
router.put('/:id/status', protect, authorize('admin', 'department_official'), updateStatus);
router.put('/:id/assign', protect, authorize('admin'), assignComplaint);
router.post('/:id/upvote', protect, upvoteComplaint);
router.post('/:id/feedback', protect, submitFeedback);

module.exports = router;