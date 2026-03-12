const express = require('express');
const router = express.Router();

// Import all controller functions
const {
  registerPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  searchPatients
} = require('../controllers/patientController');

// @route   POST /patients
// @desc    Register a new patient
// @access  Public
router.post('/', registerPatient);

// @route   GET /patients/search
// @desc    Search patients by name or disease
// @access  Public
// CRITICAL: This route MUST be before /:id to avoid treating "search" as an ID
router.get('/search', searchPatients);

// @route   GET /patients
// @desc    Get all patients
// @access  Public
router.get('/', getAllPatients);

// @route   GET /patients/:id
// @desc    Get patient by ID
// @access  Public
router.get('/:id', getPatientById);

// @route   PUT /patients/:id
// @desc    Update patient by ID
// @access  Public
router.put('/:id', updatePatient);

// @route   DELETE /patients/:id
// @desc    Delete patient by ID
// @access  Public
router.delete('/:id', deletePatient);

module.exports = router;
