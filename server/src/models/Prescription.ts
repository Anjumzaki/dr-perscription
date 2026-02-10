import mongoose, { Document, Schema } from 'mongoose';

export interface IMedication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  route?: string;
  notes?: string;
}

export interface IPrescriptionPatient {
  id?: string; // Reference to actual Patient document
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
  address?: string;
  emergencyContact?: string;
}

export interface IDiagnosis {
  primaryDiagnosis: string;
  secondaryDiagnosis?: string;
  symptoms: string[];
  duration: string;
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

export interface ILifestyle {
  dietaryAdvice: string[];
  exerciseRecommendations: string[];
  lifestyleModifications: string[];
  followUpInstructions: string;
}

export interface IVitals {
  bloodPressure?: string;
  temperature?: string;
  heartRate?: string;
  weight?: string;
  height?: string;
  bmi?: string;
  oxygenSaturation?: string;
  respiratoryRate?: string;
}

export interface ITests {
  orderedTests: string[];
  labResults?: string[];
  imagingResults?: string[];
  testNotes?: string;
}

export interface IPrescription extends Document {
  prescriptionNumber: string;
  doctorId: mongoose.Types.ObjectId;
  patientId?: mongoose.Types.ObjectId; // Reference to Patient document
  patient: IPrescriptionPatient;
  diagnosis: IDiagnosis[];
  lifestyle: ILifestyle;
  vitals: IVitals;
  tests: ITests;
  medications: IMedication[];
  notes?: string;
  dateIssued: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MedicationSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  dosage: {
    type: String,
    required: true,
    trim: true
  },
  frequency: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  instructions: {
    type: String,
    trim: true
  },
  route: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
});

const PrescriptionPatientSchema: Schema = new Schema({
  id: {
    type: String, // Reference to Patient document ID
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 150
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  emergencyContact: {
    type: String,
    trim: true
  }
});

const DiagnosisSchema: Schema = new Schema({
  primaryDiagnosis: {
    type: String,
    required: true,
    trim: true
  },
  secondaryDiagnosis: {
    type: String,
    trim: true
  },
  symptoms: {
    type: [String],
    default: []
  },
  duration: {
    type: String,
    trim: true
  },
  severity: {
    type: String,
    enum: ['mild', 'moderate', 'severe'],
    required: true
  },
  notes: {
    type: String,
    trim: true
  }
});

const LifestyleSchema: Schema = new Schema({
  dietaryAdvice: {
    type: [String],
    default: []
  },
  exerciseRecommendations: {
    type: [String],
    default: []
  },
  lifestyleModifications: {
    type: [String],
    default: []
  },
  followUpInstructions: {
    type: String,
    trim: true
  }
});

const VitalsSchema: Schema = new Schema({
  bloodPressure: {
    type: String,
    trim: true
  },
  temperature: {
    type: String,
    trim: true
  },
  heartRate: {
    type: String,
    trim: true
  },
  weight: {
    type: String,
    trim: true
  },
  height: {
    type: String,
    trim: true
  },
  bmi: {
    type: String,
    trim: true
  },
  oxygenSaturation: {
    type: String,
    trim: true
  },
  respiratoryRate: {
    type: String,
    trim: true
  }
});

const TestsSchema: Schema = new Schema({
  orderedTests: {
    type: [String],
    default: []
  },
  labResults: {
    type: [String],
    default: []
  },
  imagingResults: {
    type: [String],
    default: []
  },
  testNotes: {
    type: String,
    trim: true
  }
});

const PrescriptionSchema: Schema = new Schema({
  prescriptionNumber: {
    type: String,
    required: true,
    unique: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  },
  patient: {
    type: PrescriptionPatientSchema,
    required: true
  },
diagnosis: {
  type: [DiagnosisSchema],
  required: true,
  validate: {
    validator: function (diagnoses: IDiagnosis[]) {
      return diagnoses.length > 0;
    },
    message: 'At least one diagnosis is required'
  }
},

  lifestyle: {
    type: LifestyleSchema,
    required: true
  },
  vitals: {
    type: VitalsSchema,
    required: true
  },
  tests: {
    type: TestsSchema,
    required: true
  },
  medications: {
    type: [MedicationSchema],
    required: true,
    validate: {
      validator: function(medications: IMedication[]) {
        return medications.length > 0;
      },
      message: 'At least one medication is required'
    }
  },
  notes: {
    type: String,
    trim: true
  },
  dateIssued: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
});

PrescriptionSchema.pre('save', async function(next) {
  if (!this.prescriptionNumber) {
    const count = await mongoose.model('Prescription').countDocuments();
    this.prescriptionNumber = `RX${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

export default mongoose.model<IPrescription>('Prescription', PrescriptionSchema);