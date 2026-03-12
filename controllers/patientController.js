const Patient = require('../models/patientModel');

// @desc    Register a new patient
// @route   POST /patients
// @access  Public
const registerPatient = async (req, res, next) => {
  try {
    // Extract patient data from request body
    const patientData = req.body;

    // Create new patient in database
    const patient = await Patient.create(patientData);

    // Return 201 status with created patient (including _id)
    res.status(201).json(patient);
  } catch (error) {
    // Pass errors to global error handler
    next(error);
  }
};

// @desc    Get all patients
// @route   GET /patients
// @access  Public
const getAllPatients = async (req, res, next) => {
  try {
    // Retrieve all patients from database
    const patients = await Patient.find();

    // Return 200 status with array of patients
    res.status(200).json(patients);
  } catch (error) {
    // Pass errors to global error handler
    next(error);
  }
};

// @desc    Get patient by ID
// @route   GET /patients/:id
// @access  Public
const getPatientById = async (req, res, next) => {
  try {
    // Extract patient ID from request parameters
    const patientId = req.params.id;

    // Find patient by ID in database
    const patient = await Patient.findById(patientId);

    // If patient not found, return 404 error
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Return 200 status with patient data
    res.status(200).json(patient);
  } catch (error) {
    // Pass errors to global error handler
    next(error);
  }
};

// @desc    Update patient by ID
// @route   PUT /patients/:id
// @access  Public
const updatePatient = async (req, res, next) => {
  try {
    // Extract patient ID from request parameters
    const patientId = req.params.id;

    // Extract update data from request body
    const updateData = req.body;

    // Update patient using findByIdAndUpdate with options
    const patient = await Patient.findByIdAndUpdate(
      patientId,
      updateData,
      { new: true, runValidators: true }
    );

    // If patient not found, return 404 error
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Return 200 status with updated patient data
    res.status(200).json(patient);
  } catch (error) {
    // Pass errors to global error handler
    next(error);
  }
};

// @desc    Delete patient by ID
// @route   DELETE /patients/:id
// @access  Public
const deletePatient = async (req, res, next) => {
  try {
    // Extract patient ID from request parameters
    const patientId = req.params.id;

    // Delete patient using findByIdAndDelete
    const patient = await Patient.findByIdAndDelete(patientId);

    // If patient not found, return 404 error
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Return 200 status with success message
    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    // Pass errors to global error handler
    next(error);
  }
};

// @desc    Search patients by name or disease
// @route   GET /patients/search
// @access  Public
const searchPatients = async (req, res, next) => {
  try {
    // Extract name and disease from query parameters
    const { name, disease } = req.query;

    // If neither parameter provided, return 400 error
    if (!name && !disease) {
      return res.status(400).json({ message: 'Please provide name or disease parameter for search' });
    }

    // Build search query
    let searchQuery = {};

    if (name && disease) {
      // Both parameters provided - use $and logic
      searchQuery = {
        $and: [
          { fullName: { $regex: name, $options: 'i' } },
          { disease: { $regex: disease, $options: 'i' } }
        ]
      };
    } else if (name) {
      // Only name parameter provided
      searchQuery = { fullName: { $regex: name, $options: 'i' } };
    } else {
      // Only disease parameter provided
      searchQuery = { disease: { $regex: disease, $options: 'i' } };
    }

    // Execute search using Patient.find()
    const patients = await Patient.find(searchQuery);

    // Return 200 status with array of matching patients (empty array if no matches)
    res.status(200).json(patients);
  } catch (error) {
    // Pass errors to global error handler
    next(error);
  }
};


module.exports = {
  registerPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  searchPatients
};
