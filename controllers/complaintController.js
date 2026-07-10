const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Department = require('../models/Department');
const Notification = require('../models/Notification');
const Reward = require('../models/Reward');
const { classifyComplaint, detectDuplicate } = require('../services/geminiService');
const { mapCategoryToDepartment } = require('../services/nagrik360ClassificationService');
const { transcribeAudio } = require('../services/groqService');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinaryService');
const { determineFileType } = require('../middleware/upload');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

// Generate unique complaint ID
const generateComplaintId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = uuidv4().substring(0, 6).toUpperCase();
  return `NGR-${timestamp}-${random}`;
};

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { title, description, location, category } = req.body;

    // Parse location if string
    let parsedLocation = location;
    if (typeof location === 'string') {
      try {
        parsedLocation = JSON.parse(location);
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: 'Invalid location format. Must be a valid JSON object with coordinates.',
        });
      }
    }

    if (!parsedLocation || !parsedLocation.coordinates) {
      return res.status(400).json({
        success: false,
        message: 'Location with coordinates is required.',
      });
    }

    // Handle file uploads
    const media = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const uploaded = await uploadToCloudinary(file.path, 'nagrik360/complaints');
          media.push({
            url: uploaded.url,
            publicId: uploaded.publicId,
            type: determineFileType(file.mimetype),
          });
        } catch (uploadError) {
          console.error('File upload error:', uploadError.message);
        }
      }
    }

    // Check for audio files and transcribe
    const audioFiles = req.files && Array.isArray(req.files)
      ? req.files.filter((f) => f.mimetype.startsWith('audio/'))
      : [];
    let transcribedText = '';
    if (audioFiles.length > 0) {
      try {
        transcribedText = await transcribeAudio(audioFiles[0].path);
      } catch (transcribeError) {
        console.error('Transcription error:', transcribeError.message);
      }
    }

    // Combine description with transcription
    const fullDescription = transcribedText
      ? `${description}\n\n[Audio Transcription]: ${transcribedText}`
      : description;

    // AI Classification with Nagarik360 scoring
    const aiResult = await classifyComplaint(title, fullDescription, {
      address: parsedLocation.address || '',
      nearbyLandmarks: '',
      duplicateCount: 0,
    });

    // Determine category (user-provided takes precedence, else use Nagarik360 category)
    const finalCategory = category || aiResult.category || 'Other';

    // Auto-assign department based on Nagarik360 department mapping
    // First try to find a department by the Nagarik360 department name
    const nagrikDeptName = aiResult.nagrik_department || '';
    let department = null;

    if (nagrikDeptName) {
      department = await Department.findOne({
        name: { $regex: new RegExp(nagrikDeptName, 'i') },
        isActive: true,
      });
    }

    // Fallback: try to find by legacy category
    if (!department) {
      department = await Department.findOne({
        categories: finalCategory,
        isActive: true,
      });
    }

    // Generate complaint ID
    const complaintId = generateComplaintId();

    const complaint = await Complaint.create({
      complaintId,
      user: req.user._id,
      title,
      description: fullDescription,
      category: finalCategory,
      subcategory: aiResult.category || '',
      priority: aiResult.priority || 'medium',
      location: parsedLocation,
      media,
      aiClassification: {
        summary: aiResult.summary || '',
        category: aiResult.category || '',
        priority: aiResult.priority || '',
        sentiment: aiResult.sentiment || '',
        confidence: aiResult.confidence || 0,
        // Nagarik360 scoring fields
        safety_score: aiResult.safety_score || 0,
        severity_score: aiResult.severity_score || 0,
        time_sensitivity_score: aiResult.time_sensitivity_score || 0,
        detected_keywords: aiResult.detected_keywords || [],
        nagrik_department: aiResult.nagrik_department || '',
      },
      department: department ? department._id : null,
      timeline: [
        {
          status: 'pending',
          remark: 'Complaint submitted successfully.',
          updatedBy: req.user._id,
          updatedAt: new Date(),
        },
      ],
    });

    // Update user complaint count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { complaintsCount: 1 },
    });

    // Add reward for submitting complaint
    const reward = await Reward.create({
      user: req.user._id,
      type: 'points',
      title: 'Complaint Submitted',
      description: 'Thank you for submitting a complaint. You earned 10 points!',
      points: 10,
      source: 'complaint_submitted',
      complaint: complaint._id,
    });

    // Update user reward points
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { rewardPoints: 10 },
    });

    // Create notification
    await Notification.create({
      user: req.user._id,
      title: 'Complaint Submitted',
      message: `Your complaint "${title}" has been submitted successfully. Complaint ID: ${complaintId}`,
      type: 'complaint_submitted',
      complaint: complaint._id,
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully.',
      complaint,
      reward: {
        points: 10,
        message: 'You earned 10 points for submitting this complaint!',
      },
    });
  } catch (error) {
    console.error('CreateComplaint Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error creating complaint.',
    });
  }
};

// @desc    Get all complaints (with filters)
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
  try {
    const {
      status,
      category,
      priority,
      department,
      city,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 10,
      sort = '-createdAt',
    } = req.query;

    const query = {};

    // Filter by user role
    if (req.user.role === 'citizen') {
      query.user = req.user._id;
    } else if (req.user.role === 'department_official') {
      query.department = req.user.department;
    }

    // Apply filters
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (department) query.department = department;
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { complaintId: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [complaints, total] = await Promise.all([
      Complaint.find(query)
        .populate('user', 'name email avatar')
        .populate('department', 'name code')
        .populate('assignedTo', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Complaint.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: complaints.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      complaints,
    });
  } catch (error) {
    console.error('GetComplaints Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching complaints.',
    });
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
const getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name email phone avatar')
      .populate('department', 'name code contactEmail contactPhone')
      .populate('assignedTo', 'name email')
      .populate('duplicateOf', 'complaintId title status')
      .populate('timeline.updatedBy', 'name role');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    // Check access
    if (
      req.user.role === 'citizen' &&
      complaint.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this complaint.',
      });
    }

    res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error('GetComplaint Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching complaint.',
    });
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private (Admin/Department Official)
const updateStatus = async (req, res) => {
  try {
    const { status, remark } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required.',
      });
    }

    const validStatuses = ['pending', 'under_review', 'in_progress', 'resolved', 'rejected', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    // Update status and add to timeline
    complaint.status = status;
    complaint.timeline.push({
      status,
      remark: remark || `Status updated to ${status}`,
      updatedBy: req.user._id,
      updatedAt: new Date(),
    });

    // If resolved, update resolution fields
    if (status === 'resolved') {
      complaint.resolution = {
        description: remark || 'Complaint has been resolved.',
        resolvedAt: new Date(),
        resolvedBy: req.user._id,
      };

      // Update user resolved count
      await User.findByIdAndUpdate(complaint.user, {
        $inc: { resolvedCount: 1, rewardPoints: 50 },
      });

      // Add resolution reward
      await Reward.create({
        user: complaint.user,
        type: 'points',
        title: 'Complaint Resolved',
        description: 'Your complaint has been resolved! You earned 50 points.',
        points: 50,
        source: 'complaint_resolved',
        complaint: complaint._id,
      });
    }

    await complaint.save();

    // Create notification for the user
    await Notification.create({
      user: complaint.user,
      title: `Complaint ${status.replace('_', ' ')}`,
      message: `Your complaint "${complaint.title}" (${complaint.complaintId}) status has been updated to "${status.replace('_', ' ')}".`,
      type: 'status_update',
      complaint: complaint._id,
    });

    // Update department stats if assigned
    if (complaint.department) {
      const updateFields = { $inc: {} };
      if (status === 'resolved') {
        updateFields.$inc.complaintsResolved = 1;
      }
      if (Object.keys(updateFields.$inc).length > 0) {
        await Department.findByIdAndUpdate(complaint.department, updateFields);
      }
    }

    res.status(200).json({
      success: true,
      message: `Complaint status updated to ${status}.`,
      complaint,
    });
  } catch (error) {
    console.error('UpdateStatus Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error updating complaint status.',
    });
  }
};

// @desc    Assign complaint to department/official
// @route   PUT /api/complaints/:id/assign
// @access  Private (Admin)
const assignComplaint = async (req, res) => {
  try {
    const { departmentId, assignedTo } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    if (departmentId) {
      const department = await Department.findById(departmentId);
      if (!department) {
        return res.status(404).json({
          success: false,
          message: 'Department not found.',
        });
      }
      complaint.department = departmentId;

      await Department.findByIdAndUpdate(departmentId, {
        $inc: { complaintsAssigned: 1 },
      });
    }

    if (assignedTo) {
      const official = await User.findById(assignedTo);
      if (!official || official.role !== 'department_official') {
        return res.status(400).json({
          success: false,
          message: 'Invalid official assigned.',
        });
      }
      complaint.assignedTo = assignedTo;
    }

    complaint.timeline.push({
      status: complaint.status,
      remark: 'Complaint reassigned.',
      updatedBy: req.user._id,
      updatedAt: new Date(),
    });

    await complaint.save();

    res.status(200).json({
      success: true,
      message: 'Complaint assigned successfully.',
      complaint,
    });
  } catch (error) {
    console.error('AssignComplaint Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error assigning complaint.',
    });
  }
};

// @desc    Upvote a complaint
// @route   POST /api/complaints/:id/upvote
// @access  Private
const upvoteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    const alreadyUpvoted = complaint.upvotes.includes(req.user._id);

    if (alreadyUpvoted) {
      complaint.upvotes.pull(req.user._id);
      complaint.upvoteCount = Math.max(0, complaint.upvoteCount - 1);
      await complaint.save();

      return res.status(200).json({
        success: true,
        message: 'Upvote removed.',
        upvoteCount: complaint.upvoteCount,
      });
    }

    complaint.upvotes.push(req.user._id);
    complaint.upvoteCount += 1;
    await complaint.save();

    // Notify complaint owner
    if (complaint.user.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: complaint.user,
        title: 'Complaint Upvoted',
        message: `Your complaint "${complaint.title}" received an upvote.`,
        type: 'complaint_submitted',
        complaint: complaint._id,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Complaint upvoted.',
      upvoteCount: complaint.upvoteCount,
    });
  } catch (error) {
    console.error('UpvoteComplaint Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error upvoting complaint.',
    });
  }
};

// @desc    Submit feedback for a complaint
// @route   POST /api/complaints/:id/feedback
// @access  Private
const submitFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating is required and must be between 1 and 5.',
      });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    if (complaint.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the complaint owner can submit feedback.',
      });
    }

    if (complaint.status !== 'resolved') {
      return res.status(400).json({
        success: false,
        message: 'Feedback can only be submitted for resolved complaints.',
      });
    }

    complaint.feedback = {
      rating,
      comment: comment || '',
      submittedAt: new Date(),
    };

    await complaint.save();

    // Reward for feedback
    await Reward.create({
      user: req.user._id,
      type: 'points',
      title: 'Feedback Submitted',
      description: 'Thank you for your feedback! You earned 15 points.',
      points: 15,
      source: 'feedback_given',
      complaint: complaint._id,
    });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { rewardPoints: 15 },
    });

    res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully.',
      feedback: complaint.feedback,
    });
  } catch (error) {
    console.error('SubmitFeedback Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error submitting feedback.',
    });
  }
};

// @desc    Check for duplicates
// @route   POST /api/complaints/check-duplicate
// @access  Private
const checkDuplicate = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required.',
      });
    }

    // Find recent similar complaints (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentComplaints = await Complaint.find({
      createdAt: { $gte: thirtyDaysAgo },
      status: { $ne: 'closed' },
    })
      .select('title description complaintId status')
      .limit(10);

    if (recentComplaints.length === 0) {
      return res.status(200).json({
        success: true,
        isDuplicate: false,
        message: 'No potential duplicates found.',
      });
    }

    const analysis = await detectDuplicate(title, description, recentComplaints);

    res.status(200).json({
      success: true,
      isDuplicate: analysis.isDuplicate,
      duplicateComplaint: analysis.isDuplicate && analysis.duplicateOf >= 0
        ? recentComplaints[analysis.duplicateOf]
        : null,
      confidence: analysis.confidence,
      reason: analysis.reason,
    });
  } catch (error) {
    console.error('CheckDuplicate Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error checking duplicates.',
    });
  }
};

// @desc    Get complaints near a location
// @route   GET /api/complaints/nearby
// @access  Private
const getNearbyComplaints = async (req, res) => {
  try {
    const { lng, lat, maxDistance = 5000 } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({
        success: false,
        message: 'Longitude (lng) and latitude (lat) are required.',
      });
    }

    const complaints = await Complaint.find({
      'location': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(maxDistance),
        },
      },
      status: { $ne: 'closed' },
    })
      .populate('user', 'name')
      .limit(20);

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error('GetNearbyComplaints Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching nearby complaints.',
    });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaint,
  updateStatus,
  assignComplaint,
  upvoteComplaint,
  submitFeedback,
  checkDuplicate,
  getNearbyComplaints,
};