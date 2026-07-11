require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const run = async () => {
  try {
    await connectDB();
    const email = process.env.ADMIN_EMAIL || 'admin@nagrik360.local';
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Admin already exists:', existing.email);
      process.exit(0);
    }

    const admin = new User({
      name: process.env.ADMIN_NAME || 'Admin User',
      email,
      password: process.env.ADMIN_PASSWORD || 'adminpass',
      role: 'admin',
      isActive: true,
    });

    await admin.save();
    console.log('Admin created:', admin.email);
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err.message);
    process.exit(1);
  }
};

run();
