"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePatient = exports.updatePatient = exports.getPatientById = exports.getPatients = exports.createPatient = void 0;
const Patient_1 = __importDefault(require("../models/Patient"));
const createPatient = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { name, age, gender, phone, email, address, emergencyContact, allergies, comorbidities, smokingHistory, occupationalExposure, insuranceId } = req.body;
        // Check if patient with same phone number already exists for this doctor
        const existingPatient = await Patient_1.default.findOne({
            doctorId: req.user._id,
            phone
        });
        if (existingPatient) {
            return res.status(400).json({
                message: 'A patient with this phone number already exists'
            });
        }
        const patient = new Patient_1.default({
            name,
            age,
            gender,
            phone,
            email,
            address,
            emergencyContact,
            allergies,
            comorbidities,
            smokingHistory,
            occupationalExposure,
            insuranceId,
            doctorId: req.user._id
        });
        await patient.save();
        res.status(201).json({
            message: 'Patient created successfully',
            patient: {
                id: patient._id,
                name: patient.name,
                age: patient.age,
                gender: patient.gender,
                phone: patient.phone,
                email: patient.email,
                address: patient.address,
                emergencyContact: patient.emergencyContact,
                allergies: patient.allergies,
                comorbidities: patient.comorbidities,
                smokingHistory: patient.smokingHistory,
                occupationalExposure: patient.occupationalExposure,
                insuranceId: patient.insuranceId,
                createdAt: patient.createdAt,
                updatedAt: patient.updatedAt
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.createPatient = createPatient;
const getPatients = async (req, res) => {
    try {
        const { search, limit = 50, page = 1 } = req.query;
        let query = { doctorId: req.user._id };
        // Add search functionality
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        const patients = await Patient_1.default.find(query)
            .sort({ updatedAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .select('-doctorId -__v');
        const total = await Patient_1.default.countDocuments(query);
        res.json({
            patients: patients.map(patient => ({
                id: patient._id,
                name: patient.name,
                age: patient.age,
                gender: patient.gender,
                phone: patient.phone,
                email: patient.email,
                address: patient.address,
                emergencyContact: patient.emergencyContact,
                allergies: patient.allergies,
                comorbidities: patient.comorbidities,
                smokingHistory: patient.smokingHistory,
                occupationalExposure: patient.occupationalExposure,
                insuranceId: patient.insuranceId,
                createdAt: patient.createdAt,
                updatedAt: patient.updatedAt
            })),
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit))
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getPatients = getPatients;
const getPatientById = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patient_1.default.findOne({
            _id: id,
            doctorId: req.user._id
        }).select('-doctorId -__v');
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json({
            id: patient._id,
            name: patient.name,
            age: patient.age,
            gender: patient.gender,
            phone: patient.phone,
            email: patient.email,
            address: patient.address,
            emergencyContact: patient.emergencyContact,
            allergies: patient.allergies,
            comorbidities: patient.comorbidities,
            smokingHistory: patient.smokingHistory,
            occupationalExposure: patient.occupationalExposure,
            insuranceId: patient.insuranceId,
            createdAt: patient.createdAt,
            updatedAt: patient.updatedAt
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getPatientById = getPatientById;
const updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, gender, phone, email, address, emergencyContact, allergies, comorbidities, smokingHistory, occupationalExposure, insuranceId } = req.body;
        // Check if patient exists and belongs to this doctor
        const patient = await Patient_1.default.findOne({
            _id: id,
            doctorId: req.user._id
        });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        // Check if phone number is being changed and if it conflicts with another patient
        if (phone !== patient.phone) {
            const existingPatient = await Patient_1.default.findOne({
                doctorId: req.user._id,
                phone,
                _id: { $ne: id }
            });
            if (existingPatient) {
                return res.status(400).json({
                    message: 'A patient with this phone number already exists'
                });
            }
        }
        const updatedPatient = await Patient_1.default.findByIdAndUpdate(id, {
            name,
            age,
            gender,
            phone,
            email,
            address,
            emergencyContact,
            allergies,
            comorbidities,
            smokingHistory,
            occupationalExposure,
            insuranceId
        }, { new: true, runValidators: true }).select('-doctorId -__v');
        res.json({
            message: 'Patient updated successfully',
            patient: {
                id: updatedPatient._id,
                name: updatedPatient.name,
                age: updatedPatient.age,
                gender: updatedPatient.gender,
                phone: updatedPatient.phone,
                email: updatedPatient.email,
                address: updatedPatient.address,
                emergencyContact: updatedPatient.emergencyContact,
                allergies: updatedPatient.allergies,
                comorbidities: updatedPatient.comorbidities,
                smokingHistory: updatedPatient.smokingHistory,
                occupationalExposure: updatedPatient.occupationalExposure,
                insuranceId: updatedPatient.insuranceId,
                createdAt: updatedPatient.createdAt,
                updatedAt: updatedPatient.updatedAt
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updatePatient = updatePatient;
const deletePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patient_1.default.findOneAndDelete({
            _id: id,
            doctorId: req.user._id
        });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json({ message: 'Patient deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.deletePatient = deletePatient;
