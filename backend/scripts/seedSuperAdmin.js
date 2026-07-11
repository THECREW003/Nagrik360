require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const SuperAdmin = require('../models/SuperAdmin');

const run = async () => {
  try {
    await connectDB();

    const dbName = mongoose.connection.db.databaseName;
    console.log('Connected to database:', dbName);

    const email = 'admin@nagrik360.gov.in';
    const password = 'Admin@123';

    const allDocs = await mongoose.connection.db
      .collection('superadmins')
      .find({}, { projection: { email: 1, name: 1, _id: 1 } })
      .toArray();
    console.log('Existing superadmins:', allDocs.length ? JSON.stringify(allDocs) : 'NONE');

    const existing = await SuperAdmin.findOne({ email });
    if (existing) {
      existing.password = password;
      await existing.save();
      console.log('Super admin already existed — password updated for:', existing.email);
      process.exit(0);
    }

    const admin = new SuperAdmin({
      name: 'Super Admin',
      email,
      password,
      isActive: true,
    });

    await admin.save();
    console.log('Super admin created:', admin.email);
    console.log('You can now login with:');
    console.log('  Email   :', email);
    console.log('  Password:', password);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding super admin:', err.message);
    process.exit(1);
  }
};

run();
