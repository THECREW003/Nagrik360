const jwt = require('jsonwebtoken');
const SuperAdmin = require('../models/SuperAdmin');

const superAdminProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized as Super Admin.',
      });
    }

    const superAdmin = await SuperAdmin.findById(decoded.id);

    if (!superAdmin) {
      return res.status(401).json({
        success: false,
        message: 'Super Admin not found with this token.',
      });
    }

    if (!superAdmin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Super Admin account has been deactivated.',
      });
    }

    req.superAdmin = superAdmin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Invalid token.',
    });
  }
};

module.exports = { superAdminProtect };
