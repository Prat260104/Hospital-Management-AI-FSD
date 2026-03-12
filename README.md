# Hospital Patient Management System Backend API

A comprehensive REST API for managing hospital patient records, built with Node.js, Express.js, and MongoDB. This backend-only system provides complete CRUD operations with search capabilities, robust validation, and error handling.

## Features

- Complete CRUD operations for patient records
- Advanced search functionality (by name or disease)
- Automatic patient ID generation
- Data validation and error handling
- MongoDB Atlas integration
- RESTful API design
- Production-ready deployment configuration

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Environment Management**: dotenv

## Patient Data Model

Each patient record contains the following fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Auto-generated | Unique patient identifier |
| fullName | String | Yes | Patient's full name |
| email | String | Yes (Unique) | Patient's email address |
| phoneNumber | String | Yes | Patient's contact number |
| age | Number | Yes | Patient's age (must be positive) |
| gender | String | No | Patient's gender (Male, Female, Other) |
| disease | String | Yes | Diagnosis or disease |
| doctorAssigned | String | Yes | Assigned doctor's name |
| admissionDate | Date | No | Date of admission (defaults to current date) |
| roomNumber | String | No | Hospital room number |
| patientType | String | No | Inpatient or Outpatient |
| status | String | No | Admitted or Discharged (default: Admitted) |
| createdAt | Date | Auto-generated | Record creation timestamp |
| updatedAt | Date | Auto-generated | Record update timestamp |

## API Endpoints

### Health Check

**GET /**
- Description: Check if API is running
- Response: 200 OK
```json
{
  "message": "Hospital Patient Management API is running"
}
```

### Register New Patient

**POST /patients**
- Description: Create a new patient record
- Request Body:
```json
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
}
```
- Success Response: 201 Created
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

### Get All Patients

**GET /patients**
- Description: Retrieve all patient records
- Success Response: 200 OK
```json
[
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
]
```

### Get Patient by ID

**GET /patients/:id**
- Description: Retrieve a specific patient by ID
- URL Parameter: `id` - MongoDB ObjectId
- Success Response: 200 OK
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

### Update Patient

**PUT /patients/:id**
- Description: Update an existing patient record
- URL Parameter: `id` - MongoDB ObjectId
- Request Body (partial update allowed):
```json
{
  "status": "Discharged",
  "roomNumber": "B-205"
}
```
- Success Response: 200 OK
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
  "roomNumber": "B-205",
  "patientType": "Inpatient",
  "status": "Discharged",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T14:20:00.000Z",
  "__v": 0
}
```

### Delete Patient

**DELETE /patients/:id**
- Description: Delete a patient record
- URL Parameter: `id` - MongoDB ObjectId
- Success Response: 200 OK
```json
{
  "message": "Patient deleted successfully"
}
```

### Search Patients

**GET /patients/search**
- Description: Search patients by name or disease
- Query Parameters:
  - `name` - Search by patient name (case-insensitive partial match)
  - `disease` - Search by disease (case-insensitive partial match)
  - Both parameters can be combined for AND logic

**Examples:**

Search by name:
```
GET /patients/search?name=john
```

Search by disease:
```
GET /patients/search?disease=diabetes
```

Combined search:
```
GET /patients/search?name=john&disease=hypertension
```

- Success Response: 200 OK
```json
[
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
]
```

## Error Responses

### 400 Bad Request
Returned when validation fails or required fields are missing.

**Missing Required Fields:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "fullName": "Full name is required",
    "email": "Email is required"
  }
}
```

**Duplicate Email:**
```json
{
  "success": false,
  "message": "Email already exists"
}
```

**Invalid Data:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "age": "Age must be a positive number"
  }
}
```

**Missing Search Parameters:**
```json
{
  "message": "Please provide name or disease parameter for search"
}
```

### 404 Not Found
Returned when a patient with the specified ID doesn't exist.

```json
{
  "message": "Patient not found"
}
```

### 500 Internal Server Error
Returned when an unexpected server error occurs.

```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details"
}
```

## Local Development Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB installation)
- Git

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd hospital-patient-management-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hospital_db?retryWrites=true&w=majority
```

Replace `username`, `password`, and `cluster` with your MongoDB Atlas credentials.

4. **Run the server**

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose the free tier (M0)
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Configure Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password
   - Grant "Read and write to any database" privileges
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for development
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `hospital_db` (or your preferred database name)

6. **Update .env file**
   - Paste the connection string into your `.env` file as `MONGODB_URI`

## Render Deployment

### Prerequisites
- GitHub account
- Render account (free tier available)
- MongoDB Atlas cluster (configured as above)

### Deployment Steps

1. **Push Code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Create Render Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - **Name**: hospital-patient-management-api
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

3. **Configure Environment Variables**
   - In the Render dashboard, go to "Environment"
   - Add the following environment variables:
     - `PORT`: 5000
     - `MONGODB_URI`: Your MongoDB Atlas connection string
   - Click "Save Changes"

4. **Deploy**
   - Render will automatically deploy your application
   - Wait for the build and deployment to complete
   - Your API will be available at: `https://your-service-name.onrender.com`

5. **Test Deployment**
   - Visit `https://your-service-name.onrender.com/` to check the health endpoint
   - Use Postman to test other endpoints with the production URL

### Important Notes
- Free tier services on Render may spin down after inactivity
- First request after inactivity may take 30-60 seconds to respond
- For production use, consider upgrading to a paid plan

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port number | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb+srv://user:pass@cluster.mongodb.net/hospital_db |

## Testing with Postman

### Setup Postman Collection

1. **Create a new collection** named "Hospital Patient Management API"

2. **Set up environment variables** in Postman:
   - `base_url`: `http://localhost:5000` (for local testing)
   - `base_url`: `https://your-service.onrender.com` (for production testing)

3. **Create requests for each endpoint:**

### Postman Request Examples

**1. Health Check**
- Method: GET
- URL: `{{base_url}}/`

**2. Register Patient**
- Method: POST
- URL: `{{base_url}}/patients`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
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
}
```

**3. Get All Patients**
- Method: GET
- URL: `{{base_url}}/patients`

**4. Get Patient by ID**
- Method: GET
- URL: `{{base_url}}/patients/{{patient_id}}`
- Note: Replace `{{patient_id}}` with an actual patient ID from a previous response

**5. Update Patient**
- Method: PUT
- URL: `{{base_url}}/patients/{{patient_id}}`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "status": "Discharged",
  "roomNumber": "B-205"
}
```

**6. Delete Patient**
- Method: DELETE
- URL: `{{base_url}}/patients/{{patient_id}}`

**7. Search by Name**
- Method: GET
- URL: `{{base_url}}/patients/search?name=john`

**8. Search by Disease**
- Method: GET
- URL: `{{base_url}}/patients/search?disease=diabetes`

**9. Combined Search**
- Method: GET
- URL: `{{base_url}}/patients/search?name=john&disease=hypertension`

### Testing Workflow

1. Start with the Health Check to verify the API is running
2. Register 3-5 patients using the sample data below
3. Get all patients to verify they were created
4. Get a specific patient by ID
5. Update a patient's status or room number
6. Search for patients by name or disease
7. Delete a patient
8. Verify deletion by trying to get the deleted patient (should return 404)

## Example Test Data

Use these sample patients for testing:

**Patient 1:**
```json
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
}
```

**Patient 2:**
```json
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
}
```

**Patient 3:**
```json
{
  "fullName": "Robert Brown",
  "email": "robert.brown@example.com",
  "phoneNumber": "+1122334455",
  "age": 67,
  "gender": "Male",
  "disease": "Arthritis",
  "doctorAssigned": "Dr. Emily Davis",
  "roomNumber": "C-310",
  "patientType": "Inpatient"
}
```

**Patient 4:**
```json
{
  "fullName": "Maria Garcia",
  "email": "maria.garcia@example.com",
  "phoneNumber": "+1555666777",
  "age": 28,
  "gender": "Female",
  "disease": "Asthma",
  "doctorAssigned": "Dr. James Wilson",
  "roomNumber": "A-205",
  "patientType": "Outpatient"
}
```

**Patient 5:**
```json
{
  "fullName": "David Lee",
  "email": "david.lee@example.com",
  "phoneNumber": "+1999888777",
  "age": 54,
  "gender": "Male",
  "disease": "Heart Disease",
  "doctorAssigned": "Dr. Sarah Smith",
  "roomNumber": "D-101",
  "patientType": "Inpatient"
}
```

## Project Structure

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

## API Design Principles

- RESTful architecture
- Consistent JSON responses
- Proper HTTP status codes
- Comprehensive error handling
- Input validation at schema level
- Case-insensitive search functionality
- Automatic timestamp management

## License

ISC

## Author

Hospital Patient Management System Backend API

---

**Note**: This is a backend-only API designed for educational purposes and B.Tech practical examinations. For production use, consider adding authentication, authorization, rate limiting, and additional security measures.
