require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const SuperAdmin = require('../models/SuperAdmin');

const run = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Create Super Admin
    const superAdminEmail = 'admin@nagrik360.local';
    const existingSuperAdmin = await SuperAdmin.findOne({ email: superAdminEmail });
    
    if (!existingSuperAdmin) {
      const superAdmin = new SuperAdmin({
        name: 'Super Admin',
        email: superAdminEmail,
        password: 'adminpass',
        isActive: true,
      });
      await superAdmin.save();
      console.log('✅ Super Admin created:', superAdminEmail);
    } else {
      console.log('ℹ️ Super Admin already exists:', superAdminEmail);
    }

    // Create Regular Admin
    const adminEmail = 'admin@nagrik360.gov.in';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const admin = new User({
        name: 'Department Admin',
        email: adminEmail,
        password: 'admin123',
        role: 'admin',
        isActive: true,
      });
      await admin.save();
      console.log('✅ Regular Admin created:', adminEmail);
    } else {
      console.log('ℹ️ Regular Admin already exists:', adminEmail);
    }

    // Create Test Citizen
    const citizenEmail = 'citizen@test.com';
    const existingCitizen = await User.findOne({ email: citizenEmail });
    
    if (!existingCitizen) {
      const citizen = new User({
        name: 'Test Citizen',
        email: citizenEmail,
        password: 'citizen123',
        role: 'citizen',
        isActive: true,
        phone: '9876543210',
      });
      await citizen.save();
      console.log('✅ Test Citizen created:', citizenEmail);
    } else {
      console.log('ℹ️ Test Citizen already exists:', citizenEmail);
    }

    console.log('\n📋 Admin Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Super Admin Login:');
    console.log('  Email: admin@nagrik360.local');
    console.log('  Password: adminpass');
    console.log('  URL: http://localhost:5173/admin/login');
    console.log('');
    console.log('Regular Admin Login:');
    console.log('  Email: admin@nagrik360.gov.in');
    console.log('  Password: admin123');
    console.log('  URL: http://localhost:5173/login');
    console.log('');
    console.log('Test Citizen Login:');
    console.log('  Email: citizen@test.com');
    console.log('  Password: citizen123');
    console.log('  URL: http://localhost:5173/login');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding admins:', err.message);
    process.exit(1);
  }
};

run();
