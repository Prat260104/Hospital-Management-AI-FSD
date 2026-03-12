# Design Document: Hospital Patient Management System Backend API

## Overview

The Hospital Patient Management System Backend API is a RESTful web service built with Node.js, Express.js, and MongoDB. The system provides comprehensive CRUD operations for managing hospital patient records with robust validation, error handling, and search capabilities. The architecture follows the MVC pattern with clear separation of concerns across configuration, models, controllers, routes, and middleware layers.

The API is designed for deployment on Render with MongoDB Atlas, making it production-ready and accessible for examination purposes. All endpoints return JSON responses with appropriate HTTP status codes, and the system includes comprehensive error handling to ensure reliable operation.

## Architecture

### System Architecture

The application follows a layered architecture pattern:

```
┌─────────────────────────────────────────┐
│         HTTP Client (Postman)           │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Express.js Server               │
│  ┌─────────────────────────────────┐   │
│  │   Middleware Layer              │   │
│  │   - express.json()              │   │
│  │   - Error Handler               │   │
│  └─────────────┬───────────────────┘   │
│                │                        │
│  ┌─────────────▼───────────────────┐   │
│  │   Routes Layer                  │   │
│  │   - /patients routes            │   │
│  │   - / health check              │   │
│  └─────────────┬───────────────────┘   │
│                │                        │
│  ┌─────────────▼───────────────────┐   │
│  │   Controllers Layer             │   │
│  │   - Patient Controller          │   │
│  │   - Request validation          │   │
│  │   - Response formatting         │   │
│  └─────────────┬───────────────────┘   │
└────────────────┼───────────────────────┘
                 │
┌────────────────▼───────────────────────┐
│         Mongoose ODM                    │
│  ┌─────────────────────────────────┐   │
│  │   Models Layer                  │   │
│  │   - Patient Model               │   │
│  │   - Schema Validation           │   │
│  └─────────────┬───────────────────┘   │
└────────────────┼───────────────────────┘
                 │
┌────────────────▼───────────────────────┐
│         MongoDB Atlas                   │
│         (patients collection)           │
└─────────────────────────────────────────┘
```

### Project Structure

```
hospital-patient-management-api/
├── config/
│   └── db.js                    # MongoDB connection configuration
├── controllers/
│   └── patientController.js     # Patient CRUD operations logic
├── models/
│   └── patientModel.js          # Mongoose schema and model
├── routes/
│   └── patientRoutes.js         # API endpoint definitions
├── middleware/
│   └── errorMiddleware.js       # Global error handling
├── .env                         # Environment variables (not in git)
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── server.js                    # Application entry point
├── package.json                 # Dependencies and scripts
└── README.md                    # Documentation
```

### Technology Stack

- **Runtime**: Node.js (v14+ recommended)
- **Framework**: Express.js 4.x
- **Database**: MongoDB Atlas
- **ODM**: Mongoose 6.x+
- **Environment**: dotenv
- **Deployment**: Render
- **Testing**: Postman

## Components and Interfaces

### 1. Server Entry Point (server.js)

**Responsibility**: Initialize the Express application, connect to MongoDB, configure middleware, register routes, and start the HTTP server.

**Interface**:
```javascript
// Starts the Express server
function startServer(): void

// Environment variables required:
// - PORT: Server port (default: 5000)
// - MONGODB_URI: MongoDB connection string
```

**Key Operations**:
- Load environment variables using dotenv
- Establish MongoDB connection via db.js
- Configure express.json() middleware
- Register patient routes
- Register error handling middleware
- Start HTTP server on specified port

### 2. Database Configuration (config/db.js)

**Responsibility**: Manage MongoDB connection using Mongoose.

**Interface**:
```javascript
// Establishes connection to MongoDB
async function connectDB(): Promise<void>
  // Throws: Error if connection fails
  // Logs: Success message on connection
  // Logs: Error message on failure
```

**Configuration**:
- Uses MONGODB_URI from environment variables
- Mongoose connection options: useNewUrlParser, useUnifiedTopology
- Handles connection errors gracefully
- Logs connection status

### 3. Patient Model (models/patientModel.js)

**Responsibility**: Define the patient data schema with validation rules and create the Mongoose model.

**Schema Definition**:
```javascript
PatientSchema {
  fullName: String (required, trimmed)
  email: String (required, unique, lowercase, trimmed)
  phoneNumber: String (required, trimmed)
  age: Number (required, min: 0)
  gender: String (enum: ['Male', 'Female', 'Other'])
  disease: String (required, trimmed)
  doctorAssigned: String (required, trimmed)
  admissionDate: Date (default: Date.now)
  roomNumber: String (optional, trimmed)
  patientType: String (enum: ['Inpatient', 'Outpatient'])
  status: String (enum: ['Admitted', 'Discharged'], default: 'Admitted')
  timestamps: true (createdAt, updatedAt)
}
```

**Model Interface**:
```javascript
// Mongoose model for Patient
const Patient = mongoose.model('Patient', PatientSchema)

// Inherits all Mongoose model methods:
// - Patient.create(data): Create new patient
// - Patient.find(query): Find patients
// - Patient.findById(id): Find by ID
// - Patient.findByIdAndUpdate(id, data, options): Update patient
// - Patient.findByIdAndDelete(id): Delete patient
```

### 4. Patient Controller (controllers/patientController.js)

**Responsibility**: Handle HTTP requests, interact with the Patient model, and format responses.

**Interface**:

```javascript
// Register a new patient
async function registerPatient(req, res, next): Promise<void>
  // Input: req.body contains patient data
  // Output: 201 with created patient, or 400/500 with error
  // Validates: All required fields present
  // Creates: New patient record in database

// Get all patients
async function getAllPatients(req, res, next): Promise<void>
  // Input: None
  // Output: 200 with array of patients, or 500 with error
  // Returns: All patient records

// Get patient by ID
async function getPatientById(req, res, next): Promise<void>
  // Input: req.params.id
  // Output: 200 with patient, 404 if not found, or 500 with error
  // Validates: ID format and existence

// Update patient
async function updatePatient(req, res, next): Promise<void>
  // Input: req.params.id, req.body with update data
  // Output: 200 with updated patient, 404 if not found, 400/500 with error
  // Validates: ID existence and update data
  // Updates: Patient record with new data

// Delete patient
async function deletePatient(req, res, next): Promise<void>
  // Input: req.params.id
  // Output: 200 with success message, 404 if not found, or 500 with error
  // Validates: ID existence
  // Deletes: Patient record from database

// Search patients
async function searchPatients(req, res, next): Promise<void>
  // Input: req.query.name or req.query.disease
  // Output: 200 with matching patients array, 400 if no params, or 500 with error
  // Searches: Case-insensitive partial match on name or disease
  // Returns: Array of matching patients (empty if no matches)
```

**Error Handling**:
- All functions wrapped in try-catch blocks
- Errors passed to next() for global error handler
- Validation errors return 400
- Not found errors return 404
- Database errors return 500

### 5. Patient Routes (routes/patientRoutes.js)

**Responsibility**: Define API endpoints and map them to controller functions.

**Route Definitions**:
```javascript
// Health check
GET /
  → Returns: { message: "Hospital Patient Management API is running" }
  → Status: 200

// Register new patient
POST /patients
  → Controller: registerPatient
  → Body: Patient data (JSON)
  → Returns: Created patient with _id
  → Status: 201 (success), 400 (validation error), 500 (server error)

// Get all patients
GET /patients
  → Controller: getAllPatients
  → Returns: Array of all patients
  → Status: 200 (success), 500 (server error)

// Get patient by ID
GET /patients/:id
  → Controller: getPatientById
  → Params: id (MongoDB ObjectId)
  → Returns: Single patient object
  → Status: 200 (success), 404 (not found), 500 (server error)

// Update patient
PUT /patients/:id
  → Controller: updatePatient
  → Params: id (MongoDB ObjectId)
  → Body: Updated patient data (JSON)
  → Returns: Updated patient object
  → Status: 200 (success), 404 (not found), 400 (validation error), 500 (server error)

// Delete patient
DELETE /patients/:id
  → Controller: deletePatient
  → Params: id (MongoDB ObjectId)
  → Returns: Success message
  → Status: 200 (success), 404 (not found), 500 (server error)

// Search patients
GET /patients/search
  → Controller: searchPatients
  → Query: name=xyz OR disease=xyz (or both)
  → Returns: Array of matching patients
  → Status: 200 (success), 400 (no params), 500 (server error)
```

**Route Ordering**:
- `/patients/search` must be defined BEFORE `/patients/:id` to avoid treating "search" as an ID

### 6. Error Middleware (middleware/errorMiddleware.js)

**Responsibility**: Catch and format all errors consistently across the application.

**Interface**:
```javascript
// Global error handler
function errorHandler(err, req, res, next): void
  // Input: Error object from controllers or Express
  // Output: JSON error response with appropriate status code
  // Handles: Validation errors, cast errors, duplicate key errors, generic errors
```

**Error Response Format**:
```javascript
{
  success: false,
  message: "Error description",
  error: "Detailed error information (development only)"
}
```

**Error Type Handling**:
- **Mongoose ValidationError**: Extract validation messages, return 400
- **Mongoose CastError**: Invalid ID format, return 400
- **MongoDB Duplicate Key Error (code 11000)**: Duplicate email, return 400
- **Generic Errors**: Return 500 with error message

## Data Models

### Patient Document Structure

The Patient model represents a hospital patient record stored in MongoDB.

**MongoDB Document**:
```javascript
{
  _id: ObjectId,                    // Auto-generated by MongoDB
  fullName: String,                 // Patient's full name
  email: String,                    // Unique email address
  phoneNumber: String,              // Contact phone number
  age: Number,                      // Patient age (positive)
  gender: String,                   // 'Male', 'Female', or 'Other'
  disease: String,                  // Diagnosis or disease
  doctorAssigned: String,           // Assigned doctor's name
  admissionDate: Date,              // Date of admission (defaults to now)
  roomNumber: String,               // Hospital room number (optional)
  patientType: String,              // 'Inpatient' or 'Outpatient'
  status: String,                   // 'Admitted' or 'Discharged' (default: 'Admitted')
  createdAt: Date,                  // Auto-generated timestamp
  updatedAt: Date,                  // Auto-updated timestamp
  __v: Number                       // Mongoose version key
}
```

### Field Specifications

| Field | Type | Required | Unique | Default | Validation |
|-------|------|----------|--------|---------|------------|
| _id | ObjectId | Auto | Yes | Auto-generated | MongoDB ObjectId |
| fullName | String | Yes | No | - | Non-empty, trimmed |
| email | String | Yes | Yes | - | Non-empty, lowercase, trimmed |
| phoneNumber | String | Yes | No | - | Non-empty, trimmed |
| age | Number | Yes | No | - | Minimum: 0 |
| gender | String | No | No | - | Enum: ['Male', 'Female', 'Other'] |
| disease | String | Yes | No | - | Non-empty, trimmed |
| doctorAssigned | String | Yes | No | - | Non-empty, trimmed |
| admissionDate | Date | No | No | Date.now | Valid date |
| roomNumber | String | No | No | - | Trimmed |
| patientType | String | No | No | - | Enum: ['Inpatient', 'Outpatient'] |
| status | String | No | No | 'Admitted' | Enum: ['Admitted', 'Discharged'] |
| createdAt | Date | Auto | No | Auto | Timestamp |
| updatedAt | Date | Auto | No | Auto | Timestamp |

### Data Validation Rules

**Schema-Level Validation** (Mongoose):
- Required fields: fullName, email, phoneNumber, age, disease, doctorAssigned
- Unique constraint: email
- Enum constraints: gender, patientType, status
- Minimum value: age >= 0
- String transformations: trim, lowercase (email)

**Application-Level Validation** (Controller):
- Check for missing required fields before database operation
- Validate MongoDB ObjectId format for ID parameters
- Ensure search queries contain at least one parameter (name or disease)

### Database Indexes

**Automatic Indexes**:
- `_id`: Primary key (unique, auto-indexed by MongoDB)
- `email`: Unique index (created by Mongoose unique constraint)

**Recommended Indexes** (for performance):
- `fullName`: Text index for faster name searches
- `disease`: Text index for faster disease searches
- `status`: Regular index for filtering by admission status

### Example Patient Document

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1234567890",
  "age": 45,
  "gender": "Male",
  "disease": "Hypertension",
  "doctorAssigned": "Dr. Sarah Smith",
  "admissionDate": "2024-01-15T10:30:00.000Z",
  "roomNumber": "A-101",
  "patientType": "Inpatient",
  "status": "Admitted",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "__v": 0
}
```


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Patient Creation Round Trip

*For any* valid patient data (containing all required fields: fullName, email, phoneNumber, age, disease, doctorAssigned), when a patient is created via POST /patients, the system should return HTTP status 201 with a response containing all the input data plus a generated _id field, and retrieving that patient by ID should return the same data.

**Validates: Requirements 4.2, 4.3, 4.4, 12.1**

### Property 2: Unique Email Constraint

*For any* patient email address, if a patient with that email already exists in the database, attempting to create another patient with the same email should fail with HTTP status 400 and a duplicate key error message.

**Validates: Requirements 3.3**

### Property 3: Default Status Value

*For any* valid patient data that omits the status field, creating the patient should result in a stored record with status set to "Admitted".

**Validates: Requirements 3.8**

### Property 4: Get All Patients Completeness

*For any* set of N patients created in the database, calling GET /patients should return HTTP status 200 with an array containing exactly N patient records.

**Validates: Requirements 5.2, 5.3**

### Property 5: Get Patient By ID Retrieval

*For any* patient created in the database, calling GET /patients/:id with that patient's _id should return HTTP status 200 with a response containing the same patient data that was stored.

**Validates: Requirements 5.5, 5.6**

### Property 6: Patient Update Persistence

*For any* existing patient and any valid update data, calling PUT /patients/:id with the update data should return HTTP status 200 with the updated patient record, and subsequently retrieving that patient should reflect all the updates.

**Validates: Requirements 6.2, 6.3, 6.4**

### Property 7: Patient Deletion Removal

*For any* existing patient, calling DELETE /patients/:id should return HTTP status 200 with a success message, and subsequently attempting to retrieve that patient by ID should return HTTP status 404.

**Validates: Requirements 7.2, 7.3, 7.4**

### Property 8: Patient ID Immutability

*For any* patient created in the database, the _id field should remain unchanged regardless of any updates made to other fields.

**Validates: Requirements 12.4**

### Property 9: Default Admission Date

*For any* valid patient data that omits the admissionDate field, creating the patient should result in a stored record with admissionDate set to a valid date close to the current time (within a reasonable tolerance like 1 minute).

**Validates: Requirements 13.2**

### Property 10: Provided Admission Date Preservation

*For any* valid patient data that includes an admissionDate field, creating the patient should result in a stored record with the exact admissionDate that was provided.

**Validates: Requirements 13.3**

### Property 11: ISO 8601 Date Format

*For any* patient record retrieved from the database, the admissionDate, createdAt, and updatedAt fields should be in ISO 8601 format (matching the pattern YYYY-MM-DDTHH:mm:ss.sssZ).

**Validates: Requirements 13.4**

### Property 12: Name Search Correctness

*For any* search term and any set of patients in the database, calling GET /patients/search?name=<term> should return HTTP status 200 with an array where every patient's fullName contains the search term (case-insensitive), and no patients whose fullName doesn't contain the term are included.

**Validates: Requirements 8.2, 8.4**

### Property 13: Disease Search Correctness

*For any* search term and any set of patients in the database, calling GET /patients/search?disease=<term> should return HTTP status 200 with an array where every patient's disease contains the search term (case-insensitive), and no patients whose disease doesn't contain the term are included.

**Validates: Requirements 8.3, 8.4**

### Property 14: Combined Search AND Logic

*For any* name search term and disease search term, calling GET /patients/search?name=<name_term>&disease=<disease_term> should return HTTP status 200 with an array where every patient's fullName contains the name term AND disease contains the disease term (both case-insensitive).

**Validates: Requirements 19.4**

## Error Handling

### Error Response Format

All errors returned by the API follow a consistent JSON structure:

```json
{
  "success": false,
  "message": "Human-readable error description",
  "error": "Detailed error information (optional, development only)"
}
```

### Error Categories and HTTP Status Codes

**400 Bad Request**:
- Missing required fields (fullName, email, phoneNumber, age, disease, doctorAssigned)
- Invalid data types (e.g., negative age, invalid enum values)
- Duplicate email address (unique constraint violation)
- Malformed JSON in request body
- Invalid MongoDB ObjectId format
- Missing search parameters in /patients/search

**404 Not Found**:
- Patient ID does not exist (GET /patients/:id)
- Patient ID does not exist (PUT /patients/:id)
- Patient ID does not exist (DELETE /patients/:id)

**500 Internal Server Error**:
- Database connection failures
- Unexpected server errors
- Mongoose operation failures

### Validation Error Handling

**Mongoose Validation Errors**:
When Mongoose schema validation fails, the error handler extracts field-specific error messages:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "fullName": "Full name is required",
    "email": "Email is required",
    "age": "Age must be a positive number"
  }
}
```

**Duplicate Key Errors**:
When a unique constraint is violated (duplicate email):

```json
{
  "success": false,
  "message": "Email already exists"
}
```

**Cast Errors**:
When an invalid MongoDB ObjectId is provided:

```json
{
  "success": false,
  "message": "Invalid patient ID format"
}
```

### Error Handling Flow

```
Request → Controller (try block)
    ↓
Database Operation
    ↓
Error occurs → catch block → next(error)
    ↓
Global Error Middleware
    ↓
Identify error type:
  - ValidationError → 400
  - CastError → 400
  - Duplicate Key (11000) → 400
  - Custom 404 → 404
  - Other → 500
    ↓
Format error response
    ↓
Send JSON response with appropriate status code
```

### Controller Error Handling Pattern

All controller functions follow this pattern:

```javascript
async function controllerFunction(req, res, next) {
  try {
    // Validate input
    // Perform database operation
    // Send success response
  } catch (error) {
    next(error); // Pass to global error handler
  }
}
```

### Edge Cases

**Empty Request Body**:
- POST /patients with empty body → 400 (missing required fields)
- PUT /patients/:id with empty body → 200 (no changes made)

**Non-existent Resources**:
- GET /patients/:id with invalid ID → 404
- PUT /patients/:id with invalid ID → 404
- DELETE /patients/:id with invalid ID → 404

**Search with No Results**:
- GET /patients/search?name=nonexistent → 200 with empty array []

**Malformed JSON**:
- Any request with invalid JSON → 400 (handled by express.json() middleware)

## Testing Strategy

### Dual Testing Approach

The Hospital Patient Management System requires both unit testing and property-based testing for comprehensive coverage:

**Unit Tests**: Verify specific examples, edge cases, and error conditions
**Property Tests**: Verify universal properties across all inputs

Both testing approaches are complementary and necessary. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across a wide range of inputs.

### Property-Based Testing

**Library**: fast-check (for Node.js/JavaScript)

**Configuration**:
- Minimum 100 iterations per property test
- Each test must reference its design document property
- Tag format: `Feature: hospital-patient-management-api, Property {number}: {property_text}`

**Property Test Implementation**:

Each correctness property defined in this document must be implemented as a single property-based test. The test should:

1. Generate random valid inputs using fast-check generators
2. Execute the operation (API call or database operation)
3. Assert the property holds for all generated inputs
4. Include the property tag in a comment

**Example Property Test Structure**:

```javascript
// Feature: hospital-patient-management-api, Property 1: Patient Creation Round Trip
test('Property 1: Patient creation round trip', async () => {
  await fc.assert(
    fc.asyncProperty(
      patientDataGenerator(), // Custom generator for valid patient data
      async (patientData) => {
        // Create patient
        const createResponse = await request(app)
          .post('/patients')
          .send(patientData);
        
        expect(createResponse.status).toBe(201);
        expect(createResponse.body).toHaveProperty('_id');
        
        // Retrieve patient
        const getResponse = await request(app)
          .get(`/patients/${createResponse.body._id}`);
        
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.fullName).toBe(patientData.fullName);
        expect(getResponse.body.email).toBe(patientData.email);
        // ... assert all fields match
      }
    ),
    { numRuns: 100 }
  );
});
```

**Custom Generators**:

The test suite should include custom fast-check generators for:
- Valid patient data (all required fields)
- Patient names (realistic strings)
- Email addresses (valid format)
- Phone numbers (valid format)
- Ages (positive integers, realistic range 0-120)
- Diseases (medical condition strings)
- Doctor names (realistic strings)
- Dates (valid date ranges)
- Search terms (substrings of existing data)

### Unit Testing

**Library**: Jest with Supertest (for API testing)

**Test Categories**:

1. **Setup and Configuration Tests**:
   - Database connection succeeds
   - Environment variables are loaded
   - Server starts on correct port
   - Health check endpoint returns 200

2. **Validation Edge Cases**:
   - Missing required field: fullName
   - Missing required field: email
   - Missing required field: phoneNumber
   - Missing required field: age
   - Missing required field: disease
   - Missing required field: doctorAssigned
   - Negative age value
   - Invalid gender enum value
   - Invalid patientType enum value
   - Invalid status enum value

3. **Error Handling Edge Cases**:
   - Malformed JSON in request body
   - Invalid MongoDB ObjectId format
   - Non-existent patient ID (404)
   - Search with no parameters (400)
   - Search with no results (empty array)

4. **Integration Tests**:
   - Complete patient lifecycle (create → read → update → delete)
   - Multiple patients creation and retrieval
   - Search functionality with various terms

5. **Response Format Tests**:
   - Successful responses include correct fields
   - Error responses follow standard format
   - Validation errors include field details

**Example Unit Test**:

```javascript
describe('Patient Registration', () => {
  test('should reject patient without fullName', async () => {
    const invalidPatient = {
      email: 'test@example.com',
      phoneNumber: '1234567890',
      age: 30,
      disease: 'Flu',
      doctorAssigned: 'Dr. Smith'
    };
    
    const response = await request(app)
      .post('/patients')
      .send(invalidPatient);
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('fullName');
  });
});
```

### Test Environment Setup

**Test Database**:
- Use separate MongoDB database for testing (e.g., `hospital_test`)
- Clear database before each test suite
- Use MongoDB Memory Server for isolated testing

**Test Configuration**:
- Separate .env.test file for test environment variables
- Mock external dependencies if any
- Use beforeAll/afterAll hooks for setup/teardown
- Use beforeEach/afterEach for test isolation

### Coverage Goals

**Minimum Coverage Targets**:
- Line coverage: 90%
- Branch coverage: 85%
- Function coverage: 95%
- Statement coverage: 90%

**Critical Paths** (must have 100% coverage):
- All controller functions
- Error handling middleware
- Validation logic
- Database operations

### Test Execution

**Local Testing**:
```bash
npm test                    # Run all tests
npm run test:unit          # Run unit tests only
npm run test:property      # Run property tests only
npm run test:coverage      # Run with coverage report
```

**CI/CD Integration**:
- Run tests on every commit
- Block merges if tests fail
- Generate coverage reports
- Test against multiple Node.js versions (14, 16, 18)

### Manual Testing with Postman

While automated tests provide comprehensive coverage, manual testing with Postman is valuable for:
- Exploratory testing
- Demonstration purposes
- Examination evaluation
- API documentation validation

**Postman Collection** should include:
- All API endpoints with example requests
- Success case examples
- Error case examples
- Search query examples
- Environment variables for local and production URLs

### Test Data

**Example Test Patients**:

```json
[
  {
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1234567890",
    "age": 45,
    "gender": "Male",
    "disease": "Hypertension",
    "doctorAssigned": "Dr. Sarah Smith",
    "roomNumber": "A-101",
    "patientType": "Inpatient"
  },
  {
    "fullName": "Jane Smith",
    "email": "jane.smith@example.com",
    "phoneNumber": "+1987654321",
    "age": 32,
    "gender": "Female",
    "disease": "Diabetes",
    "doctorAssigned": "Dr. Michael Johnson",
    "roomNumber": "B-205",
    "patientType": "Outpatient"
  },
  {
    "fullName": "Robert Brown",
    "email": "robert.brown@example.com",
    "phoneNumber": "+1122334455",
    "age": 67,
    "gender": "Male",
    "disease": "Arthritis",
    "doctorAssigned": "Dr. Emily Davis",
    "patientType": "Inpatient",
    "status": "Discharged"
  }
]
```

### Testing Checklist

Before considering the implementation complete, verify:

- [ ] All 14 correctness properties have passing property tests
- [ ] All validation edge cases have passing unit tests
- [ ] All error handling scenarios have passing unit tests
- [ ] Health check endpoint works
- [ ] All CRUD operations work end-to-end
- [ ] Search functionality works for name and disease
- [ ] Combined search works correctly
- [ ] HTTP status codes are correct for all scenarios
- [ ] Error responses follow the standard format
- [ ] Database connection is properly established
- [ ] Environment variables are properly loaded
- [ ] Code coverage meets minimum targets
- [ ] Postman collection includes all endpoints
- [ ] README includes testing instructions
