import mongoose, { Document, Schema } from 'mongoose';

export interface IMedication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface IPatient {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  address?: string;
  phone?: string;
  email?: string;
}

export interface IPrescription extends Document {
  prescriptionNumber: string;
  doctorId: mongoose.Types.ObjectId;
  patient: IPatient;
  medications: IMedication[];
  diagnosis: string;
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
  }
});

const PatientSchema: Schema = new Schema({
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
  address: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
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
  patient: {
    type: PatientSchema,
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
  diagnosis: {
    type: String,
    required: true,
    trim: true
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