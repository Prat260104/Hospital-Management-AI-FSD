# Requirements Document

## Introduction

This document specifies the requirements for a Hospital Patient Management System Backend API designed for a B.Tech practical examination. The system provides a complete REST API for managing hospital patient records using Node.js, Express.js, MongoDB, and Mongoose. The backend-only system enables CRUD operations on patient records with search capabilities, proper validation, error handling, and deployment readiness.

## Glossary

- **API**: Application Programming Interface - the REST endpoints exposed by the backend
- **Patient_Record**: A document in MongoDB containing all information about a hospital patient
- **Patient_Controller**: The Express.js controller handling patient-related HTTP requests
- **Patient_Model**: The Mongoose schema and model defining patient data structure
- **Database_Connection**: MongoDB Atlas connection managed through Mongoose
- **Error_Handler**: Global Express middleware for handling errors consistently
- **Status_Code**: HTTP response status codes (200, 201, 400, 404, 500)
- **Validation**: Mongoose schema validation rules ensuring data integrity
- **Search_Query**: Query parameters for filtering patients by name or disease
- **Environment_Variable**: Configuration values stored in .env file

## Requirements

### Requirement 1: Project Setup and Configuration

**User Story:** As a developer, I want a properly configured Express.js backend with MongoDB connection, so that I can build the patient management API on a solid foundation.

#### Acceptance Criteria

1. THE System SHALL use Express.js as the web framework
2. THE System SHALL connect to MongoDB using Mongoose
3. THE System SHALL load environment variables using dotenv
4. THE System SHALL enable express.json() middleware for parsing JSON request bodies
5. THE System SHALL organize code following the specified project structure (config/, controllers/, models/, routes/, middleware/)
6. WHEN the server starts, THE System SHALL log the successful MongoDB connection
7. WHEN the server starts, THE System SHALL listen on the port specified in environment variables

### Requirement 2: Patient Data Model

**User Story:** As a hospital administrator, I want patient records to contain all necessary medical and administrative information, so that I can maintain comprehensive patient data.

#### Acceptance Criteria

1. THE Patient_Model SHALL include a unique Patient ID field
2. THE Patient_Model SHALL include Full Name as a required field
3. THE Patient_Model SHALL include Email as a required and unique field
4. THE Patient_Model SHALL include Phone Number as a required field
5. THE Patient_Model SHALL include Age as a positive number field
6. THE Patient_Model SHALL include Gender field
7. THE Patient_Model SHALL include Disease/Diagnosis as a required field
8. THE Patient_Model SHALL include Doctor Assigned as a required field
9. THE Patient_Model SHALL include Admission Date field
10. THE Patient_Model SHALL include Room Number field
11. THE Patient_Model SHALL include Patient Type field with values "Inpatient" or "Outpatient"
12. THE Patient_Model SHALL include Status field with default value "Admitted"
13. THE Patient_Model SHALL automatically generate timestamps (createdAt, updatedAt)

### Requirement 3: Data Validation

**User Story:** As a system administrator, I want strict data validation on patient records, so that only valid data is stored in the database.

#### Acceptance Criteria

1. WHEN a patient record is created without Full Name, THEN THE System SHALL reject the request with a validation error
2. WHEN a patient record is created without Email, THEN THE System SHALL reject the request with a validation error
3. WHEN a patient record is created with a duplicate Email, THEN THE System SHALL reject the request with a unique constraint error
4. WHEN a patient record is created without Phone Number, THEN THE System SHALL reject the request with a validation error
5. WHEN a patient record is created with a negative Age, THEN THE System SHALL reject the request with a validation error
6. WHEN a patient record is created without Disease, THEN THE System SHALL reject the request with a validation error
7. WHEN a patient record is created without Doctor Assigned, THEN THE System SHALL reject the request with a validation error
8. WHEN a patient record is created without Status, THEN THE System SHALL default Status to "Admitted"

### Requirement 4: Patient Registration

**User Story:** As a hospital receptionist, I want to register new patients through an API endpoint, so that I can add patient records to the system.

#### Acceptance Criteria

1. THE API SHALL expose a POST /patients endpoint
2. WHEN a valid patient record is submitted to POST /patients, THEN THE System SHALL create the patient record in the database
3. WHEN a patient is successfully created, THEN THE System SHALL return HTTP status code 201
4. WHEN a patient is successfully created, THEN THE System SHALL return the created patient record including the generated ID
5. WHEN an invalid patient record is submitted, THEN THE System SHALL return HTTP status code 400 with validation errors
6. WHEN a database error occurs during creation, THEN THE System SHALL return HTTP status code 500 with an error message

### Requirement 5: Patient Retrieval

**User Story:** As a hospital staff member, I want to retrieve patient records through API endpoints, so that I can view patient information.

#### Acceptance Criteria

1. THE API SHALL expose a GET /patients endpoint for retrieving all patients
2. WHEN GET /patients is called, THEN THE System SHALL return all patient records
3. WHEN GET /patients is called successfully, THEN THE System SHALL return HTTP status code 200
4. THE API SHALL expose a GET /patients/:id endpoint for retrieving a specific patient
5. WHEN GET /patients/:id is called with a valid patient ID, THEN THE System SHALL return that patient's record
6. WHEN GET /patients/:id is called with a valid ID successfully, THEN THE System SHALL return HTTP status code 200
7. WHEN GET /patients/:id is called with a non-existent ID, THEN THE System SHALL return HTTP status code 404
8. WHEN a database error occurs during retrieval, THEN THE System SHALL return HTTP status code 500 with an error message

### Requirement 6: Patient Update

**User Story:** As a hospital staff member, I want to update patient records through an API endpoint, so that I can modify patient information as needed.

#### Acceptance Criteria

1. THE API SHALL expose a PUT /patients/:id endpoint
2. WHEN PUT /patients/:id is called with valid data and existing ID, THEN THE System SHALL update the patient record
3. WHEN a patient is successfully updated, THEN THE System SHALL return HTTP status code 200
4. WHEN a patient is successfully updated, THEN THE System SHALL return the updated patient record
5. WHEN PUT /patients/:id is called with invalid data, THEN THE System SHALL return HTTP status code 400 with validation errors
6. WHEN PUT /patients/:id is called with a non-existent ID, THEN THE System SHALL return HTTP status code 404
7. WHEN a database error occurs during update, THEN THE System SHALL return HTTP status code 500 with an error message

### Requirement 7: Patient Deletion

**User Story:** As a hospital administrator, I want to delete patient records through an API endpoint, so that I can remove records when necessary.

#### Acceptance Criteria

1. THE API SHALL expose a DELETE /patients/:id endpoint
2. WHEN DELETE /patients/:id is called with an existing patient ID, THEN THE System SHALL remove the patient record from the database
3. WHEN a patient is successfully deleted, THEN THE System SHALL return HTTP status code 200
4. WHEN a patient is successfully deleted, THEN THE System SHALL return a success message
5. WHEN DELETE /patients/:id is called with a non-existent ID, THEN THE System SHALL return HTTP status code 404
6. WHEN a database error occurs during deletion, THEN THE System SHALL return HTTP status code 500 with an error message

### Requirement 8: Patient Search

**User Story:** As a hospital staff member, I want to search for patients by name or disease, so that I can quickly find specific patient records.

#### Acceptance Criteria

1. THE API SHALL expose a GET /patients/search endpoint with query parameters
2. WHEN GET /patients/search?name=xyz is called, THEN THE System SHALL return all patients whose Full Name contains "xyz" (case-insensitive)
3. WHEN GET /patients/search?disease=xyz is called, THEN THE System SHALL return all patients whose Disease contains "xyz" (case-insensitive)
4. WHEN a search is successful, THEN THE System SHALL return HTTP status code 200
5. WHEN a search returns no results, THEN THE System SHALL return an empty array with HTTP status code 200
6. WHEN a database error occurs during search, THEN THE System SHALL return HTTP status code 500 with an error message

### Requirement 9: Error Handling

**User Story:** As a developer, I want comprehensive error handling throughout the application, so that errors are caught and returned consistently to API clients.

#### Acceptance Criteria

1. THE System SHALL implement a global error handling middleware
2. THE System SHALL wrap all controller functions in try-catch blocks
3. THE System SHALL use async/await for all database operations
4. WHEN a validation error occurs, THEN THE Error_Handler SHALL return HTTP status code 400
5. WHEN a resource is not found, THEN THE Error_Handler SHALL return HTTP status code 404
6. WHEN a server error occurs, THEN THE Error_Handler SHALL return HTTP status code 500
7. WHEN an error occurs, THEN THE Error_Handler SHALL return a JSON response with an error message
8. WHEN a Mongoose validation error occurs, THEN THE Error_Handler SHALL extract and return validation error details

### Requirement 10: Deployment Configuration

**User Story:** As a developer, I want the application configured for deployment to Render with MongoDB Atlas, so that the system can run in production.

#### Acceptance Criteria

1. THE System SHALL store sensitive configuration in environment variables
2. THE System SHALL support MongoDB Atlas connection strings
3. THE System SHALL read PORT from environment variables with a fallback default
4. THE System SHALL read MONGODB_URI from environment variables
5. THE System SHALL include a .env.example file documenting required environment variables
6. THE System SHALL include a package.json with all required dependencies
7. THE System SHALL include a start script in package.json for production deployment

### Requirement 11: API Documentation

**User Story:** As a developer or examiner, I want comprehensive API documentation, so that I can understand how to use all endpoints and deploy the system.

#### Acceptance Criteria

1. THE System SHALL include a README.md file
2. THE README SHALL document all API endpoints with request/response examples
3. THE README SHALL include setup instructions for local development
4. THE README SHALL include deployment instructions for Render and MongoDB Atlas
5. THE README SHALL include example environment variable configuration
6. THE README SHALL include instructions for testing with Postman
7. THE README SHALL include example test data for all endpoints


### Requirement 12: Automatic Patient ID Generation

**User Story:** As a hospital administrator, I want patient IDs to be automatically generated and unique, so that I don't have to manually assign IDs and can avoid duplicates.

#### Acceptance Criteria

1. THE Patient_Model SHALL automatically generate a unique Patient ID for each new patient record
2. THE System SHALL use MongoDB's default _id field as the Patient ID
3. WHEN a patient record is created, THEN THE System SHALL return the generated Patient ID in the response
4. THE Patient_ID SHALL be immutable after creation

### Requirement 13: Admission Date Management

**User Story:** As a hospital staff member, I want admission dates to be automatically recorded, so that I can track when patients were admitted without manual entry.

#### Acceptance Criteria

1. THE Patient_Model SHALL include an Admission Date field of type Date
2. WHEN a patient record is created without an Admission Date, THEN THE System SHALL default to the current date and time
3. WHEN a patient record is created with an Admission Date, THEN THE System SHALL use the provided date
4. THE System SHALL store Admission Date in ISO 8601 format

### Requirement 14: Room Number Data Type

**User Story:** As a hospital administrator, I want room numbers to be stored consistently, so that I can manage room assignments effectively.

#### Acceptance Criteria

1. THE Patient_Model SHALL define Room Number as a String or Number type
2. THE Patient_Model SHALL allow Room Number to be optional
3. WHEN a patient record is created without a Room Number, THEN THE System SHALL accept the record
4. WHEN a patient record includes a Room Number, THEN THE System SHALL store it in the database

### Requirement 15: HTTP Status Code Compliance

**User Story:** As an API consumer, I want consistent and correct HTTP status codes, so that I can properly handle responses in my client application.

#### Acceptance Criteria

1. THE System SHALL return HTTP status code 200 for successful GET, PUT, and DELETE operations
2. THE System SHALL return HTTP status code 201 for successful POST operations that create resources
3. THE System SHALL return HTTP status code 400 for requests with invalid data or validation errors
4. THE System SHALL return HTTP status code 404 for requests to non-existent resources
5. THE System SHALL return HTTP status code 500 for internal server errors or database failures
6. WHEN multiple error conditions exist, THEN THE System SHALL return the most specific applicable status code

### Requirement 16: Version Control and Repository

**User Story:** As a developer or examiner, I want the project stored in a GitHub repository, so that I can access the code, track changes, and evaluate the implementation.

#### Acceptance Criteria

1. THE System SHALL be stored in a GitHub repository
2. THE Repository SHALL include a .gitignore file excluding node_modules and .env
3. THE Repository SHALL include all source code files
4. THE Repository SHALL include package.json and package-lock.json
5. THE Repository SHALL include README.md with complete documentation
6. THE Repository SHALL have a clear commit history showing development progress

### Requirement 17: Production Deployment

**User Story:** As an examiner, I want the application deployed to Render with MongoDB Atlas, so that I can test the live API without local setup.

#### Acceptance Criteria

1. THE System SHALL be deployable to Render platform
2. THE System SHALL connect to MongoDB Atlas in production
3. THE System SHALL use environment variables for all configuration in production
4. WHEN deployed, THE System SHALL be accessible via a public HTTPS URL
5. THE System SHALL handle CORS appropriately for API access
6. THE Deployment SHALL use the production MongoDB Atlas cluster
7. THE System SHALL log successful startup and database connection in production

### Requirement 18: Postman Testing Documentation

**User Story:** As an examiner or developer, I want detailed Postman testing instructions, so that I can easily test all API endpoints.

#### Acceptance Criteria

1. THE Documentation SHALL include example requests for all endpoints
2. THE Documentation SHALL include example request bodies in JSON format
3. THE Documentation SHALL include example response bodies for success cases
4. THE Documentation SHALL include example response bodies for error cases
5. THE Documentation SHALL include sample test data for creating patients
6. THE Documentation SHALL include instructions for importing requests into Postman
7. THE Documentation SHALL include the base URL format for both local and production testing

### Requirement 19: Combined Search Functionality

**User Story:** As a hospital staff member, I want to search patients by either name or disease using the same endpoint, so that I have a flexible search interface.

#### Acceptance Criteria

1. THE API SHALL support GET /patients/search?name=xyz for name-based search
2. THE API SHALL support GET /patients/search?disease=xyz for disease-based search
3. THE Search SHALL perform case-insensitive partial matching
4. WHEN both name and disease parameters are provided, THEN THE System SHALL search using both criteria (AND logic)
5. WHEN no search parameters are provided, THEN THE System SHALL return HTTP status code 400 with an error message
6. THE Search SHALL return an array of matching patient records
7. THE Search SHALL return an empty array when no matches are found

### Requirement 20: API Request and Response Examples

**User Story:** As a developer or examiner, I want comprehensive API request and response examples, so that I can understand the exact data format expected by each endpoint.

#### Acceptance Criteria

1. THE Documentation SHALL include a complete example POST request body for patient registration
2. THE Documentation SHALL include a complete example response for successful patient creation
3. THE Documentation SHALL include example responses for validation errors
4. THE Documentation SHALL include example responses for 404 errors
5. THE Documentation SHALL include example responses for 500 errors
6. THE Documentation SHALL include example GET responses with patient arrays
7. THE Documentation SHALL include example PUT request bodies
8. THE Documentation SHALL include example search query URLs with results
9. THE Documentation SHALL show the exact JSON structure for all request and response bodies


### Requirement 21: JSON Request Parsing

**User Story:** As an API consumer, I want the server to correctly parse JSON request bodies, so that I can send structured data to the API.

#### Acceptance Criteria

1. THE System SHALL use express.json() middleware to parse incoming JSON request bodies
2. WHEN a request contains valid JSON, THEN THE System SHALL make the parsed body available in req.body
3. WHEN a request contains malformed JSON, THEN THE System SHALL return HTTP status code 400 with an error message
4. THE System SHALL only accept Content-Type: application/json for API requests with body content
5. THE System SHALL handle empty request bodies appropriately for endpoints that don't require body data

### Requirement 22: API Health Check Endpoint

**User Story:** As a developer or examiner, I want a simple endpoint to verify that the API server is running, so that I can quickly check deployment status.

#### Acceptance Criteria

1. THE API SHALL expose a GET / endpoint
2. WHEN the root endpoint is accessed, THEN THE System SHALL return HTTP status code 200
3. THE Response SHALL include a JSON message confirming the API is operational
4. THE Health_Check endpoint SHALL not require authentication
5. THE Health_Check endpoint SHALL confirm the API server is running successfully
6. THE Response SHALL include the API name or version information
