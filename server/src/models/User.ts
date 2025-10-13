import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'doctor' | 'admin';
  licenseNumber?: string;
  specialization?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['doctor', 'admin'],
    default: 'doctor'
  },
  licenseNumber: {
    type: String,
    required: function(this: IUser) {
      return this.role === 'doctor';
    }
  },
  specialization: {
    type: String,
    required: function(this: IUser) {
      return this.role === 'doctor';
    }
  }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);