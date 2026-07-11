const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Create a department official
const createOfficer = async (req, res) => {
  try {
    const { name, email, password, phone, department } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'name, email and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const user = new User({ name, email: email.toLowerCase(), password, phone: phone || '', department: department || null, role: 'department_official' });
    await user.save();

    const out = user.toObject();
    delete out.password;

    res.status(201).json({ success: true, officer: out });
  } catch (err) {
    console.error('CreateOfficer Error:', err.message);
    res.status(500).json({ success: false, message: 'Server error creating officer' });
  }
};

// List officers with pagination
const listOfficers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = { role: 'department_official' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [officers, total] = await Promise.all([
      User.find(query).populate('department', 'name code').skip(skip).limit(parseInt(limit)).select('-password'),
      User.countDocuments(query),
    ]);

    res.status(200).json({ success: true, count: officers.length, total, totalPages: Math.ceil(total / parseInt(limit)), currentPage: parseInt(page), officers });
  } catch (err) {
    console.error('ListOfficers Error:', err.message);
    res.status(500).json({ success: false, message: 'Server error listing officers' });
  }
};

const getOfficer = async (req, res) => {
  try {
    const officer = await User.findById(req.params.id).select('-password').populate('department', 'name code');
    if (!officer) return res.status(404).json({ success: false, message: 'Officer not found' });
    res.status(200).json({ success: true, officer });
  } catch (err) {
    console.error('GetOfficer Error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateOfficer = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) delete updates.password; // password change not supported via this endpoint
    const officer = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password').populate('department', 'name code');
    if (!officer) return res.status(404).json({ success: false, message: 'Officer not found' });
    res.status(200).json({ success: true, officer });
  } catch (err) {
    console.error('UpdateOfficer Error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteOfficer = async (req, res) => {
  try {
    const officer = await User.findById(req.params.id);
    if (!officer) return res.status(404).json({ success: false, message: 'Officer not found' });
    await officer.remove();
    res.status(200).json({ success: true, message: 'Officer deleted' });
  } catch (err) {
    console.error('DeleteOfficer Error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { createOfficer, listOfficers, getOfficer, updateOfficer, deleteOfficer };
