import mongoose, { Document, Schema } from 'mongoose';

export interface IPatient extends Document {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
  address?: string;
  emergencyContact?: string;
  doctorId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

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
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(email: string) {
        // Only validate if email is provided
        if (!email) return true;
        return /^\S+@\S+\.\S+$/.test(email);
      },
      message: 'Invalid email format'
    }
  },
  address: {
    type: String,
    trim: true
  },
  emergencyContact: {
    type: String,
    trim: true
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster searches
PatientSchema.index({ doctorId: 1, name: 1 });
PatientSchema.index({ doctorId: 1, phone: 1 });

export default mongoose.model<IPatient>('Patient', PatientSchema);