const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { superAdminProtect } = require('../middleware/superAdminAuth');
const {
  login,
  register,
  getMe,
} = require('../controllers/superAdminController');

const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Public routes
router.post('/login', loginValidation, login);
router.post('/register', register);

// Protected routes
router.get('/me', superAdminProtect, getMe);

module.exports = router;
