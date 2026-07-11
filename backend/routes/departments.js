const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentStats,
} = require('../controllers/departmentController');

const departmentValidation = [
  body('name').trim().notEmpty().withMessage('Department name is required'),
  body('code').trim().notEmpty().withMessage('Department code is required'),
];

router.get('/stats', protect, authorize('admin'), getDepartmentStats);
router.get('/', protect, getDepartments);
router.get('/:id', protect, getDepartment);
router.post('/', protect, authorize('admin'), departmentValidation, createDepartment);
router.put('/:id', protect, authorize('admin'), updateDepartment);
router.delete('/:id', protect, authorize('admin'), deleteDepartment);

module.exports = router;