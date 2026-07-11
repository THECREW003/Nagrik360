const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createOfficer, listOfficers, getOfficer, updateOfficer, deleteOfficer } = require('../controllers/officerController');

router.use(protect);
router.use(authorize('admin'));

router.get('/', listOfficers);
router.post('/', createOfficer);
router.get('/:id', getOfficer);
router.put('/:id', updateOfficer);
router.delete('/:id', deleteOfficer);

module.exports = router;
