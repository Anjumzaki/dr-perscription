"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const MedicationSchema = new mongoose_1.Schema({
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
const PrescriptionPatientSchema = new mongoose_1.Schema({
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
const DiagnosisSchema = new mongoose_1.Schema({
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
const LifestyleSchema = new mongoose_1.Schema({
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
const VitalsSchema = new mongoose_1.Schema({
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
const TestsSchema = new mongoose_1.Schema({
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
const PrescriptionSchema = new mongoose_1.Schema({
    prescriptionNumber: {
        type: String,
        required: true,
        unique: true
    },
    doctorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patientId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
            validator: function (diagnoses) {
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
            validator: function (medications) {
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
PrescriptionSchema.pre('save', async function (next) {
    if (!this.prescriptionNumber) {
        const count = await mongoose_1.default.model('Prescription').countDocuments();
        this.prescriptionNumber = `RX${String(count + 1).padStart(6, '0')}`;
    }
    next();
});
exports.default = mongoose_1.default.model('Prescription', PrescriptionSchema);
