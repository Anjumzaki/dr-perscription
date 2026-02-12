import mongoose, { Document, Schema } from 'mongoose';

export interface ISavedSymptom extends Document {
  doctorId: mongoose.Types.ObjectId;
  symptom: string;
  count: number;
  lastUsed: Date;
}

const SavedSymptomSchema: Schema = new Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    symptom: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    count: {
      type: Number,
      default: 1,
    },
    lastUsed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

SavedSymptomSchema.index({ doctorId: 1, symptom: 1 }, { unique: true });

export default mongoose.model<ISavedSymptom>(
  'SavedSymptom',
  SavedSymptomSchema,
);
