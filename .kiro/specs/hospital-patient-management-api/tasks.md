# Implementation Plan: Hospital Patient Management System Backend API

## Overview

This implementation plan breaks down the Hospital Patient Management System Backend API into discrete, incremental coding tasks. The system will be built using Node.js, Express.js, and MongoDB with Mongoose. Each task builds on previous work, ensuring no orphaned code and maintaining a working system at each checkpoint.

The implementation follows the MVC architecture with clear separation between configuration, models, controllers, routes, and middleware. Testing tasks are included as optional sub-tasks to enable faster MVP delivery while maintaining the option for comprehensive test coverage.

## Tasks

- [x] 1. Initialize project structure and dependencies
  - Create project directory structure (config/, controllers/, models/, routes/, middleware/)
  - Initialize package.json with npm init
  - Install dependencies: express, mongoose, dotenv
  - Install dev dependencies: nodemon
  - Create .gitignore file (exclude node_modules/, .env)
  - Create .env.example file with PORT and MONGODB_URI placeholders
  - Create .env file with local configuration
  - _Requirements: 1.1, 1.3, 1.5, 10.1, 10.5, 16.2_

- [ ] 2. Set up database configuration
  - [x] 2.1 Create MongoDB connection module (config/db.js)
    - Implement connectDB() function using Mongoose
    - Use MONGODB_URI from environment variables
    - Configure Mongoose connection options
    - Add connection success and error logging
    - Export connectDB function
    - _Requirements: 1.2, 1.6, 10.2, 10.4_

  - [ ]* 2.2 Write unit test for database connection
    - Test successful connection with valid URI
    - Test connection logging
    - _Requirements: 1.2, 1.6_

- [ ] 3. Create Patient data model
  - [x] 3.1 Define Mongoose schema (models/patientModel.js)
    - Define fullName field (String, required, trim)
    - Define email field (String, required, unique, lowercase, trim)
    - Define phoneNumber field (String, required, trim)
    - Define age field (Number, required, min: 0)
    - Define gender field (String, enum: ['Male', 'Female', 'Other'])
    - Define disease field (String, required, trim)
    - Define doctorAssigned field (String, required, trim)
    - Define admissionDate field (Date, default: Date.now)
    - Define roomNumber field (String, trim)
    - Define patientType field (String, enum: ['Inpatient', 'Outpatient'])
    - Define status field (String, enum: ['Admitted', 'Discharged'], default: 'Admitted')
    - Enable timestamps (createdAt, updatedAt)
    - Create and export Patient model
    - _Requirements: 2.1-2.13, 3.1-3.8, 12.1, 12.2, 13.1, 14.1_

  - [ ]* 3.2 Write property test for default status value
    - **Property 3: Default Status Value**
    - **Validates: Requirements 3.8**
    - Generate random valid patient data without status field
    - Create patient and verify status is "Admitted"
    - _Requirements: 3.8_

  - [ ]* 3.3 Write property test for default admission date
    - **Property 9: Default Admission Date**
    - **Validates: Requirements 13.2**
    - Generate random valid patient data without admissionDate
    - Create patient and verify admissionDate is set to current time (within 1 minute tolerance)
    - _Requirements: 13.2_

  - [ ]* 3.4 Write unit tests for validation edge cases
    - Test missing fullName returns validation error
    - Test missing email returns validation error
    - Test missing phoneNumber returns validation error
    - Test missing disease returns validation error
    - Test missing doctorAssigned returns validation error
    - Test negative age returns validation error
    - _Requirements: 3.1, 3.2, 3.4, 3.5, 3.6, 3.7_

- [ ] 4. Implement error handling middleware
  - [x] 4.1 Create global error handler (middleware/errorMiddleware.js)
    - Implement errorHandler function with (err, req, res, next) signature
    - Handle Mongoose ValidationError (extract field errors, return 400)
    - Handle Mongoose CastError (invalid ObjectId, return 400)
    - Handle MongoDB duplicate key error (code 11000, return 400)
    - Handle generic errors (return 500)
    - Format error responses with success: false, message, and error details
    - Export errorHandler middleware
    - _Requirements: 9.1, 9.4, 9.5, 9.6, 9.7, 9.8, 15.3, 15.4, 15.5_

  - [ ]* 4.2 Write unit test for validation error formatting
    - Test that Mongoose validation errors return 400 with field details
    - Test that duplicate key errors return 400 with appropriate message
    - Test that cast errors return 400 with appropriate message
    - _Requirements: 9.8_

- [ ] 5. Create patient controller functions
  - [x] 5.1 Implement registerPatient controller (controllers/patientController.js)
    - Extract patient data from req.body
    - Create new patient using Patient.create()
    - Return 201 status with created patient (including _id)
    - Wrap in try-catch, pass errors to next()
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 9.2, 9.3, 12.1, 12.3, 15.2_

  - [ ]* 5.2 Write property test for patient creation round trip
    - **Property 1: Patient Creation Round Trip**
    - **Validates: Requirements 4.2, 4.3, 4.4, 12.1**
    - Generate random valid patient data
    - Create patient via POST /patients
    - Verify response status is 201
    - Verify response includes _id and all input fields
    - Retrieve patient by ID and verify data matches
    - _Requirements: 4.2, 4.3, 4.4, 12.1_

  - [ ]* 5.3 Write property test for unique email constraint
    - **Property 2: Unique Email Constraint**
    - **Validates: Requirements 3.3**
    - Generate random valid patient data
    - Create first patient successfully
    - Attempt to create second patient with same email
    - Verify second attempt returns 400 with duplicate error
    - _Requirements: 3.3_

  - [x] 5.4 Implement getAllPatients controller
    - Retrieve all patients using Patient.find()
    - Return 200 status with array of patients
    - Wrap in try-catch, pass errors to next()
    - _Requirements: 5.1, 5.2, 5.3, 9.2, 9.3, 15.1_

  - [ ]* 5.5 Write property test for get all patients completeness
    - **Property 4: Get All Patients Completeness**
    - **Validates: Requirements 5.2, 5.3**
    - Generate N random patients (where N is random between 1-10)
    - Create all N patients
    - Call GET /patients
    - Verify response status is 200
    - Verify response array contains exactly N patients
    - _Requirements: 5.2, 5.3_

  - [x] 5.6 Implement getPatientById controller
    - Extract patient ID from req.params.id
    - Find patient using Patient.findById()
    - If not found, return 404 with error message
    - If found, return 200 status with patient data
    - Wrap in try-catch, pass errors to next()
    - _Requirements: 5.4, 5.5, 5.6, 5.7, 9.2, 9.3, 15.1, 15.4_

  - [ ]* 5.7 Write property test for get patient by ID retrieval
    - **Property 5: Get Patient By ID Retrieval**
    - **Validates: Requirements 5.5, 5.6**
    - Generate random valid patient data
    - Create patient and capture _id
    - Call GET /patients/:id with the _id
    - Verify response status is 200
    - Verify response data matches created patient
    - _Requirements: 5.5, 5.6_

  - [ ]* 5.8 Write unit test for non-existent patient ID
    - Generate random valid MongoDB ObjectId that doesn't exist
    - Call GET /patients/:id with non-existent ID
    - Verify response status is 404
    - _Requirements: 5.7_

  - [x] 5.9 Implement updatePatient controller
    - Extract patient ID from req.params.id
    - Extract update data from req.body
    - Update patient using Patient.findByIdAndUpdate() with {new: true, runValidators: true}
    - If not found, return 404 with error message
    - If found, return 200 status with updated patient data
    - Wrap in try-catch, pass errors to next()
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.6, 9.2, 9.3, 15.1, 15.4_

  - [ ]* 5.10 Write property test for patient update persistence
    - **Property 6: Patient Update Persistence**
    - **Validates: Requirements 6.2, 6.3, 6.4**
    - Generate random valid patient data and create patient
    - Generate random valid update data (change some fields)
    - Call PUT /patients/:id with update data
    - Verify response status is 200
    - Verify response reflects updates
    - Retrieve patient by ID and verify updates persisted
    - _Requirements: 6.2, 6.3, 6.4_

  - [ ]* 5.11 Write property test for patient ID immutability
    - **Property 8: Patient ID Immutability**
    - **Validates: Requirements 12.4**
    - Generate random valid patient data and create patient
    - Capture original _id
    - Perform multiple updates to the patient
    - Verify _id remains unchanged after each update
    - _Requirements: 12.4_

  - [ ]* 5.12 Write unit test for update validation errors
    - Create valid patient
    - Attempt to update with invalid data (e.g., negative age)
    - Verify response status is 400 with validation error
    - _Requirements: 6.5_

  - [x] 5.13 Implement deletePatient controller
    - Extract patient ID from req.params.id
    - Delete patient using Patient.findByIdAndDelete()
    - If not found, return 404 with error message
    - If deleted, return 200 status with success message
    - Wrap in try-catch, pass errors to next()
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 9.2, 9.3, 15.1, 15.4_

  - [ ]* 5.14 Write property test for patient deletion removal
    - **Property 7: Patient Deletion Removal**
    - **Validates: Requirements 7.2, 7.3, 7.4**
    - Generate random valid patient data and create patient
    - Call DELETE /patients/:id
    - Verify response status is 200 with success message
    - Attempt to retrieve deleted patient by ID
    - Verify retrieval returns 404
    - _Requirements: 7.2, 7.3, 7.4_

  - [x] 5.15 Implement searchPatients controller
    - Extract name and disease from req.query
    - If neither parameter provided, return 400 with error message
    - Build search query using $regex for case-insensitive partial matching
    - If both parameters provided, use $and logic
    - Execute search using Patient.find()
    - Return 200 status with array of matching patients (empty array if no matches)
    - Wrap in try-catch, pass errors to next()
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.7_

  - [ ]* 5.16 Write property test for name search correctness
    - **Property 12: Name Search Correctness**
    - **Validates: Requirements 8.2, 8.4**
    - Create multiple patients with various names
    - Generate random search term that appears in some names
    - Call GET /patients/search?name=<term>
    - Verify response status is 200
    - Verify all returned patients have names containing the term (case-insensitive)
    - Verify no patients without the term are returned
    - _Requirements: 8.2, 8.4_

  - [ ]* 5.17 Write property test for disease search correctness
    - **Property 13: Disease Search Correctness**
    - **Validates: Requirements 8.3, 8.4**
    - Create multiple patients with various diseases
    - Generate random search term that appears in some diseases
    - Call GET /patients/search?disease=<term>
    - Verify response status is 200
    - Verify all returned patients have diseases containing the term (case-insensitive)
    - Verify no patients without the term are returned
    - _Requirements: 8.3, 8.4_

  - [ ]* 5.18 Write property test for combined search AND logic
    - **Property 14: Combined Search AND Logic**
    - **Validates: Requirements 19.4**
    - Create multiple patients with various names and diseases
    - Generate random name term and disease term
    - Call GET /patients/search?name=<name_term>&disease=<disease_term>
    - Verify response status is 200
    - Verify all returned patients match BOTH criteria
    - _Requirements: 19.4_

  - [ ]* 5.19 Write unit test for search with no parameters
    - Call GET /patients/search without query parameters
    - Verify response status is 400 with error message
    - _Requirements: 19.5_

  - [ ]* 5.20 Write unit test for search with no results
    - Call GET /patients/search?name=nonexistentpatient
    - Verify response status is 200 with empty array
    - _Requirements: 8.5_

  - [x] 5.21 Export all controller functions
    - Export registerPatient, getAllPatients, getPatientById, updatePatient, deletePatient, searchPatients

- [ ] 6. Set up routes
  - [x] 6.1 Create patient routes (routes/patientRoutes.js)
    - Import express and create router
    - Import all controller functions
    - Define POST /patients route → registerPatient
    - Define GET /patients/search route → searchPatients (MUST be before /:id route)
    - Define GET /patients route → getAllPatients
    - Define GET /patients/:id route → getPatientById
    - Define PUT /patients/:id route → updatePatient
    - Define DELETE /patients/:id route → deletePatient
    - Export router
    - _Requirements: 4.1, 5.1, 5.4, 7.1, 8.1_

  - [ ]* 6.2 Write unit test for route ordering
    - Verify /patients/search doesn't get caught by /:id route
    - Test that search endpoint is accessible
    - _Requirements: 8.1_

- [ ] 7. Create server entry point
  - [x] 7.1 Implement server initialization (server.js)
    - Import dotenv and configure at top of file
    - Import express, connectDB, patientRoutes, errorHandler
    - Create Express app
    - Configure express.json() middleware
    - Define GET / health check route (return 200 with JSON message)
    - Mount patient routes at /patients
    - Register error handling middleware (MUST be last)
    - Call connectDB() to establish database connection
    - Start server on PORT from environment (default 5000)
    - Log server startup message with port
    - _Requirements: 1.1, 1.3, 1.4, 1.7, 10.3, 21.1, 22.1, 22.2, 22.3_

  - [ ]* 7.2 Write unit test for health check endpoint
    - Call GET /
    - Verify response status is 200
    - Verify response includes API name or operational message
    - _Requirements: 22.2, 22.3, 22.6_

  - [ ]* 7.3 Write unit test for malformed JSON handling
    - Send POST request with malformed JSON body
    - Verify response status is 400
    - _Requirements: 21.3_

- [ ] 8. Checkpoint - Ensure all tests pass
  - Run all unit tests and property tests
  - Verify all endpoints work with manual testing
  - Ensure database connection is stable
  - Ask the user if questions arise

- [ ] 9. Add property test for date handling
  - [ ]* 9.1 Write property test for provided admission date preservation
    - **Property 10: Provided Admission Date Preservation**
    - **Validates: Requirements 13.3**
    - Generate random valid patient data with specific admissionDate
    - Create patient
    - Verify stored admissionDate matches provided date
    - _Requirements: 13.3_

  - [ ]* 9.2 Write property test for ISO 8601 date format
    - **Property 11: ISO 8601 Date Format**
    - **Validates: Requirements 13.4**
    - Generate random valid patient data and create patient
    - Retrieve patient
    - Verify admissionDate, createdAt, updatedAt match ISO 8601 pattern
    - _Requirements: 13.4_

- [ ] 10. Create comprehensive documentation
  - [x] 10.1 Write README.md
    - Add project title and description
    - Document all required fields for patient model
    - List all API endpoints with HTTP methods
    - Provide example request bodies for POST and PUT
    - Provide example response bodies for all endpoints
    - Include example error responses (400, 404, 500)
    - Document search query parameters and examples
    - Add local development setup instructions (npm install, .env configuration)
    - Add instructions for running the server locally
    - Add MongoDB Atlas setup instructions
    - Add Render deployment instructions
    - Add environment variables documentation
    - Add Postman testing instructions with example collection structure
    - Include example test data (3-5 sample patients)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 18.1-18.9, 20.1-20.9_

  - [x] 10.2 Create .env.example file
    - Document PORT variable with example value
    - Document MONGODB_URI variable with example format
    - Add comments explaining each variable
    - _Requirements: 10.5_

  - [x] 10.3 Update package.json scripts
    - Add "start": "node server.js" for production
    - Add "dev": "nodemon server.js" for development
    - Add "test": "jest" for running tests (if tests implemented)
    - _Requirements: 10.7_

- [ ] 11. Prepare for deployment
  - [x] 11.1 Verify deployment readiness
    - Ensure .gitignore excludes node_modules and .env
    - Ensure all environment variables are documented
    - Verify server uses PORT from environment
    - Verify MongoDB URI is configurable via environment
    - Test that server starts successfully with environment variables
    - _Requirements: 10.1, 10.2, 10.3, 16.2, 17.1, 17.2, 17.3_

  - [x] 11.2 Create GitHub repository
    - Initialize git repository
    - Add all files to git
    - Create initial commit
    - Push to GitHub
    - Verify README is visible on GitHub
    - _Requirements: 16.1, 16.3, 16.4, 16.5, 16.6_

  - [x] 11.3 Document deployment steps in README
    - Add section for MongoDB Atlas setup (create cluster, get connection string)
    - Add section for Render deployment (connect GitHub, configure environment variables)
    - Add section for testing deployed API (use public URL)
    - Include notes about CORS if needed
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7_

- [ ] 12. Final checkpoint - Complete system verification
  - Verify all CRUD operations work end-to-end
  - Verify search functionality works for name, disease, and combined
  - Verify all validation rules are enforced
  - Verify all HTTP status codes are correct
  - Verify error responses follow standard format
  - Test health check endpoint
  - Verify README documentation is complete and accurate
  - Ensure all tests pass (if implemented)
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and allow for user feedback
- Property tests validate universal correctness properties across many inputs
- Unit tests validate specific examples, edge cases, and error conditions
- The implementation follows a bottom-up approach: models → controllers → routes → server
- Route ordering is critical: /patients/search MUST be defined before /patients/:id
- Error handling middleware MUST be registered last in the middleware chain
- All controller functions use async/await with try-catch for error handling
- The system is designed to be production-ready and examination-ready
