const jwt = require('jsonwebtoken');
const SuperAdmin = require('../models/SuperAdmin');
const { validationResult } = require('express-validator');

// @desc    Super Admin login
// @route   POST /api/admin/login
// @access  Public
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { email, password } = req.body;

    console.log('--- Super Admin Login Attempt ---');
    console.log('Received email   :', email);
    console.log('Received password:', password);

    const mongoose = require('mongoose');
    const dbName = mongoose.connection.db.databaseName;
    const collName = mongoose.connection.db.collection('superadmins');
    const allDocs = await collName.find({}, { projection: { email: 1, name: 1, isActive: 1, _id: 1 } }).toArray();
    console.log('Connected DB     :', dbName);
    console.log('Collection       : superadmins');
    console.log('All docs in superadmins:', JSON.stringify(allDocs, null, 2));
    console.log('Total documents  :', allDocs.length);

    const superAdmin = await SuperAdmin.findOne({ email }).select('+password');
    console.log('findOne result   :', superAdmin ? `Found (id: ${superAdmin._id})` : 'null — document not in superadmins collection');

    if (!superAdmin) {
      console.log('LOGIN FAILED REASON: Super Admin not found for email:', email);
      return res.status(401).json({
        success: false,
        message: 'Super Admin not found',
      });
    }

    if (!superAdmin.isActive) {
      console.log('LOGIN FAILED REASON: Super Admin account is deactivated (id:', superAdmin._id + ')');
      return res.status(401).json({
        success: false,
        message: 'Super Admin account has been deactivated.',
      });
    }

    console.log('Stored password (raw) :', superAdmin.password);
    console.log('Stored password prefix:', superAdmin.password.substring(0, 7));

    const isMatch = await superAdmin.comparePassword(password);
    console.log('Password match result :', isMatch);

    if (!isMatch) {
      console.log('LOGIN FAILED REASON: Password mismatch for email:', email);
      return res.status(401).json({
        success: false,
        message: 'Password mismatch',
      });
    }

    console.log('LOGIN SUCCESS for:', email);

    const token = jwt.sign(
      { id: superAdmin._id, role: 'super_admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        role: 'super_admin',
      },
    });
  } catch (error) {
    console.error('--- Super Admin Login DB/Server Error ---');
    console.error('Error name   :', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack  :', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error during Super Admin login.',
    });
  }
};

// @desc    Block Super Admin registration
// @route   POST /api/admin/register
// @access  Public
const register = async (req, res) => {
  return res.status(403).json({
    success: false,
    message: 'Super Admin registration is not allowed.',
  });
};

// @desc    Get current Super Admin profile
// @route   GET /api/admin/me
// @access  Private (superAdminProtect)
const getMe = async (req, res) => {
  try {
    const superAdmin = await SuperAdmin.findById(req.superAdmin._id);

    res.status(200).json({
      success: true,
      user: {
        _id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        role: 'super_admin',
        createdAt: superAdmin.createdAt,
      },
    });
  } catch (error) {
    console.error('Super Admin GetMe Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching Super Admin profile.',
    });
  }
};

module.exports = { login, register, getMe };
