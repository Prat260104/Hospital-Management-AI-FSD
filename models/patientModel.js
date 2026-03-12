const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [0, 'Age must be a positive number']
    },
    gender: {
      type: String,
      enum: {
        values: ['Male', 'Female', 'Other'],
        message: '{VALUE} is not a valid gender'
      }
    },
    disease: {
      type: String,
      required: [true, 'Disease is required'],
      trim: true
    },
    doctorAssigned: {
      type: String,
      required: [true, 'Doctor assigned is required'],
      trim: true
    },
    admissionDate: {
      type: Date,
      default: Date.now
    },
    roomNumber: {
      type: String,
      trim: true
    },
    patientType: {
      type: String,
      enum: {
        values: ['Inpatient', 'Outpatient'],
        message: '{VALUE} is not a valid patient type'
      }
    },
    status: {
      type: String,
      enum: {
        values: ['Admitted', 'Discharged'],
        message: '{VALUE} is not a valid status'
      },
      default: 'Admitted'
    }
  },
  {
    timestamps: true
  }
);

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
