const Department = require('../models/Department');
const { validationResult } = require('express-validator');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Private
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true })
      .populate('headOfficial', 'name email')
      .populate('officials', 'name email')
      .sort('name');

    res.status(200).json({
      success: true,
      count: departments.length,
      departments,
    });
  } catch (error) {
    console.error('GetDepartments Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching departments.',
    });
  }
};

// @desc    Get single department
// @route   GET /api/departments/:id
// @access  Private
const getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('headOfficial', 'name email phone')
      .populate('officials', 'name email phone');

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found.',
      });
    }

    res.status(200).json({
      success: true,
      department,
    });
  } catch (error) {
    console.error('GetDepartment Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching department.',
    });
  }
};

// @desc    Create department
// @route   POST /api/departments
// @access  Private/Admin
const createDepartment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { name, code, description, categories, contactEmail, contactPhone } = req.body;

    const department = await Department.create({
      name,
      code,
      description: description || '',
      categories: categories || [],
      contactEmail: contactEmail || '',
      contactPhone: contactPhone || '',
    });

    res.status(201).json({
      success: true,
      message: 'Department created successfully.',
      department,
    });
  } catch (error) {
    console.error('CreateDepartment Error:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Department with this name or code already exists.',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error creating department.',
    });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private/Admin
const updateDepartment = async (req, res) => {
  try {
    const { name, description, categories, contactEmail, contactPhone, isActive, headOfficial } = req.body;

    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found.',
      });
    }

    if (name) department.name = name;
    if (description !== undefined) department.description = description;
    if (categories) department.categories = categories;
    if (contactEmail !== undefined) department.contactEmail = contactEmail;
    if (contactPhone !== undefined) department.contactPhone = contactPhone;
    if (isActive !== undefined) department.isActive = isActive;
    if (headOfficial) department.headOfficial = headOfficial;

    await department.save();

    res.status(200).json({
      success: true,
      message: 'Department updated successfully.',
      department,
    });
  } catch (error) {
    console.error('UpdateDepartment Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error updating department.',
    });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found.',
      });
    }

    department.isActive = false;
    await department.save();

    res.status(200).json({
      success: true,
      message: 'Department deactivated successfully.',
    });
  } catch (error) {
    console.error('DeleteDepartment Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error deleting department.',
    });
  }
};

// @desc    Get department statistics
// @route   GET /api/departments/stats
// @access  Private/Admin
const getDepartmentStats = async (req, res) => {
  try {
    const stats = await Department.aggregate([
      { $match: { isActive: true } },
      {
        $project: {
          name: 1,
          code: 1,
          complaintsAssigned: 1,
          complaintsResolved: 1,
          avgResolutionTime: 1,
          officialsCount: { $size: '$officials' },
          categoriesCount: { $size: '$categories' },
        },
      },
      { $sort: { complaintsAssigned: -1 } },
    ]);

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('GetDepartmentStats Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching department stats.',
    });
  }
};

module.exports = {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentStats,
};