"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSavedMedicines = exports.getSavedTests = exports.addSavedSymptom = exports.getSavedSymptoms = exports.getSavedDiagnoses = exports.deletePrescription = exports.updatePrescription = exports.getPrescriptionById = exports.getPrescriptions = exports.createPrescription = void 0;
const Prescription_1 = __importDefault(require("../models/Prescription"));
const SavedSymptom_1 = __importDefault(require("../models/SavedSymptom"));
const getNextSequence_1 = require("../utils/getNextSequence");
const createPrescription = async (req, res) => {
    try {
        const { patient, diagnosis, lifestyle, vitals, tests, medications, notes } = req.body;
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // console.log('Creating prescription with data:', {
        //   patient, diagnosis, lifestyle, vitals, tests, medications, notes
        // });
        console.log('Received prescription data');
        // Validate required fields
        if (!patient ||
            !diagnosis ||
            !lifestyle ||
            !vitals ||
            !tests ||
            !medications) {
            return res.status(400).json({
                message: 'All prescription sections are required (patient, diagnosis, lifestyle, vitals, tests, medications)',
            });
        }
        if (!medications || medications.length === 0) {
            return res.status(400).json({
                message: 'At least one medication is required',
            });
        }
        console.log('All required fields are present. Proceeding to save prescription.');
        // Generate pure serial number from Mongo
        const serial = await (0, getNextSequence_1.getNextSequence)('prescription');
        const prescriptionNumber = `RX-${serial.toString().padStart(4, '0')}`;
        const prescription = new Prescription_1.default({
            prescriptionNumber,
            doctorId: req.user._id,
            patientId: patient.id || null, // Reference to Patient document if available
            patient,
            diagnosis,
            lifestyle,
            vitals,
            tests,
            medications,
            notes,
        });
        console.log('Saving prescription');
        await prescription.save();
        console.log('Prescription saved successfully');
        await prescription.populate('doctorId', 'name licenseNumber specialization');
        res.status(201).json({
            message: 'Prescription created successfully',
            prescription,
        });
    }
    catch (error) {
        console.error('Error creating prescription:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.createPrescription = createPrescription;
const getPrescriptions = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search;
        const patientId = req.query.patientId;
        let query = { doctorId: req.user._id };
        if (patientId) {
            query.patientId = patientId;
        }
        if (search) {
            // Search by patient name, diagnosis, or prescription number
            query.$or = [
                { prescriptionNumber: { $regex: search, $options: 'i' } },
                { 'patient.name': { $regex: search, $options: 'i' } },
                { 'diagnosis.primaryDiagnosis': { $regex: search, $options: 'i' } },
                { 'diagnosis.secondaryDiagnosis': { $regex: search, $options: 'i' } },
            ];
        }
        const prescriptions = await Prescription_1.default.find(query)
            .populate('doctorId', 'name licenseNumber specialization')
            .sort({ dateIssued: -1 })
            .skip(skip)
            .limit(limit);
        const total = await Prescription_1.default.countDocuments(query);
        res.json({
            prescriptions,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getPrescriptions = getPrescriptions;
const getPrescriptionById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const prescription = await Prescription_1.default.findOne({
            _id: id,
            doctorId: req.user._id,
        }).populate('doctorId', 'name licenseNumber specialization');
        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }
        res.json({ prescription });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getPrescriptionById = getPrescriptionById;
const updatePrescription = async (req, res) => {
    try {
        const { id } = req.params;
        const { patient, diagnosis, lifestyle, vitals, tests, medications, notes } = req.body;
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const prescription = await Prescription_1.default.findOneAndUpdate({ _id: id, doctorId: req.user._id }, {
            patientId: patient.id || null,
            patient,
            diagnosis,
            lifestyle,
            vitals,
            tests,
            medications,
            notes,
        }, { new: true, runValidators: true }).populate('doctorId', 'name licenseNumber specialization');
        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }
        res.json({
            message: 'Prescription updated successfully',
            prescription,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updatePrescription = updatePrescription;
const deletePrescription = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const prescription = await Prescription_1.default.findOneAndDelete({
            _id: id,
            doctorId: req.user._id,
        });
        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }
        res.json({ message: 'Prescription deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.deletePrescription = deletePrescription;
const getSavedDiagnoses = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Get all unique diagnoses (both primary and secondary) from this doctor's prescriptions
        const diagnoses = await Prescription_1.default.aggregate([
            { $match: { doctorId: req.user._id } },
            { $unwind: '$diagnosis' },
            {
                $group: {
                    _id: null,
                    diagnoses: {
                        $push: {
                            primary: '$diagnosis.primaryDiagnosis',
                            secondary: '$diagnosis.secondaryDiagnosis',
                        },
                    },
                    lastUsed: { $max: '$dateIssued' },
                },
            },
            {
                $project: {
                    _id: 0,
                    diagnoses: 1,
                    lastUsed: 1,
                },
            },
        ]);
        // Extract unique diagnoses with counts
        const uniqueDiagnoses = {};
        if (diagnoses.length > 0) {
            diagnoses[0].diagnoses.forEach((item) => {
                // Add primary diagnosis
                if (item.primary) {
                    if (!uniqueDiagnoses[item.primary]) {
                        uniqueDiagnoses[item.primary] = {
                            count: 0,
                            lastUsed: diagnoses[0].lastUsed,
                        };
                    }
                    uniqueDiagnoses[item.primary].count += 1;
                }
                // Add secondary diagnosis if exists
                if (item.secondary) {
                    if (!uniqueDiagnoses[item.secondary]) {
                        uniqueDiagnoses[item.secondary] = {
                            count: 0,
                            lastUsed: diagnoses[0].lastUsed,
                        };
                    }
                    uniqueDiagnoses[item.secondary].count += 1;
                }
            });
        }
        // Convert to sorted array
        const result = Object.entries(uniqueDiagnoses)
            .map(([diagnosis, data]) => ({
            diagnosis,
            count: data.count,
            lastUsed: data.lastUsed,
        }))
            .sort((a, b) => b.count - a.count ||
            new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime());
        res.json({ diagnoses: result });
    }
    catch (error) {
        console.error('Error fetching saved diagnoses:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getSavedDiagnoses = getSavedDiagnoses;
const getSavedSymptoms = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Get all unique symptoms from this doctor's prescriptions
        const symptoms = await Prescription_1.default.aggregate([
            { $match: { doctorId: req.user._id } },
            { $unwind: '$diagnosis' },
            { $unwind: '$diagnosis.symptoms' },
            {
                $group: {
                    _id: '$diagnosis.symptoms',
                    count: { $sum: 1 },
                    lastUsed: { $max: '$dateIssued' },
                },
            },
            { $sort: { count: -1, lastUsed: -1 } },
            {
                $project: {
                    _id: 0,
                    symptom: '$_id',
                    count: 1,
                    lastUsed: 1,
                },
            },
        ]);
        res.json({ symptoms });
    }
    catch (error) {
        console.error('Error fetching saved symptoms:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getSavedSymptoms = getSavedSymptoms;
const addSavedSymptom = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { symptom } = req.body;
        if (!symptom || typeof symptom !== 'string' || !symptom.trim()) {
            return res.status(400).json({ message: 'Invalid symptom' });
        }
        const normalized = symptom.trim();
        // Upsert into SavedSymptom collection for this doctor
        const updated = await SavedSymptom_1.default.findOneAndUpdate({ doctorId: req.user._id, symptom: normalized }, { $inc: { count: 1 }, $set: { lastUsed: new Date() } }, { upsert: true, new: true, setDefaultsOnInsert: true });
        res
            .status(200)
            .json({ message: 'Saved symptom updated', symptom: updated });
    }
    catch (error) {
        console.error('Error saving symptom:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.addSavedSymptom = addSavedSymptom;
const getSavedTests = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Get all unique tests from this doctor's prescriptions
        const tests = await Prescription_1.default.aggregate([
            { $match: { doctorId: req.user._id } },
            { $unwind: '$tests.orderedTests' },
            {
                $group: {
                    _id: '$tests.orderedTests',
                    count: { $sum: 1 },
                    lastUsed: { $max: '$dateIssued' },
                },
            },
            { $sort: { count: -1, lastUsed: -1 } },
            {
                $project: {
                    _id: 0,
                    test: '$_id',
                    count: 1,
                    lastUsed: 1,
                },
            },
        ]);
        res.json({ tests });
    }
    catch (error) {
        console.error('Error fetching saved tests:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getSavedTests = getSavedTests;
const getSavedMedicines = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Get all unique medicines from this doctor's prescriptions
        const medicines = await Prescription_1.default.aggregate([
            { $match: { doctorId: req.user._id } },
            { $unwind: '$medications' },
            {
                $group: {
                    _id: '$medications.name',
                    count: { $sum: 1 },
                    lastUsed: { $max: '$dateIssued' },
                },
            },
            { $sort: { count: -1, lastUsed: -1 } },
            {
                $project: {
                    _id: 0,
                    medicine: '$_id',
                    count: 1,
                    lastUsed: 1,
                },
            },
        ]);
        res.json({ medicines });
    }
    catch (error) {
        console.error('Error fetching saved medicines:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getSavedMedicines = getSavedMedicines;
