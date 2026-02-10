import { Response } from 'express';
import Prescription from '../models/Prescription';
import { AuthenticatedRequest } from '../middleware/auth';
import { getNextSequence } from '../utils/getNextSequence';


export const createPrescription = async (req: AuthenticatedRequest, res: Response) => {
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
    if (!patient || !diagnosis || !lifestyle || !vitals || !tests || !medications) {
      return res.status(400).json({ 
        message: 'All prescription sections are required (patient, diagnosis, lifestyle, vitals, tests, medications)' 
      });
    }

    if (!medications || medications.length === 0) {
      return res.status(400).json({ 
        message: 'At least one medication is required' 
      });
    }
console.log('All required fields are present. Proceeding to save prescription.');

// Generate pure serial number from Mongo
const serial = await getNextSequence('prescription');

const prescriptionNumber = `RX-${serial.toString().padStart(4, '0')}`;

    const prescription = new Prescription({
      prescriptionNumber,
      doctorId: req.user._id,
      patientId: patient.id || null, // Reference to Patient document if available
      patient,
      diagnosis,
      lifestyle,
      vitals,
      tests,
      medications,
      notes
    });
console.log('Saving prescription');
    await prescription.save();
    console.log('Prescription saved successfully');
    await prescription.populate('doctorId', 'name licenseNumber specialization');

    res.status(201).json({
      message: 'Prescription created successfully',
      prescription
    });
  } catch (error) {
    console.error('Error creating prescription:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getPrescriptions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search as string;
    const patientId = req.query.patientId as string;

    let query: any = { doctorId: req.user._id };

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

    const prescriptions = await Prescription.find(query)
      .populate('doctorId', 'name licenseNumber specialization')
      .sort({ dateIssued: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Prescription.countDocuments(query);

    res.json({
      prescriptions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


export const getPrescriptionById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const prescription = await Prescription.findOne({
      _id: id,
      doctorId: req.user._id
    }).populate('doctorId', 'name licenseNumber specialization');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json({ prescription });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updatePrescription = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { patient, diagnosis, lifestyle, vitals, tests, medications, notes } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const prescription = await Prescription.findOneAndUpdate(
      { _id: id, doctorId: req.user._id },
      { 
        patientId: patient.id || null,
        patient, 
        diagnosis, 
        lifestyle, 
        vitals, 
        tests, 
        medications, 
        notes 
      },
      { new: true, runValidators: true }
    ).populate('doctorId', 'name licenseNumber specialization');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json({
      message: 'Prescription updated successfully',
      prescription
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deletePrescription = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const prescription = await Prescription.findOneAndDelete({
      _id: id,
      doctorId: req.user._id
    });

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getSavedDiagnoses = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get all unique diagnoses (both primary and secondary) from this doctor's prescriptions
    const diagnoses = await Prescription.aggregate([
      { $match: { doctorId: req.user._id } },
      { $unwind: '$diagnosis' },
      { 
        $group: { 
          _id: null,
          diagnoses: {
            $push: {
              primary: '$diagnosis.primaryDiagnosis',
              secondary: '$diagnosis.secondaryDiagnosis'
            }
          },
          lastUsed: { $max: '$dateIssued' }
        } 
      },
      {
        $project: {
          _id: 0,
          diagnoses: 1,
          lastUsed: 1
        }
      }
    ]);

    // Extract unique diagnoses with counts
    const uniqueDiagnoses: { [key: string]: { count: number; lastUsed: Date } } = {};

    if (diagnoses.length > 0) {
      diagnoses[0].diagnoses.forEach((item: any) => {
        // Add primary diagnosis
        if (item.primary) {
          if (!uniqueDiagnoses[item.primary]) {
            uniqueDiagnoses[item.primary] = { count: 0, lastUsed: diagnoses[0].lastUsed };
          }
          uniqueDiagnoses[item.primary].count += 1;
        }
        // Add secondary diagnosis if exists
        if (item.secondary) {
          if (!uniqueDiagnoses[item.secondary]) {
            uniqueDiagnoses[item.secondary] = { count: 0, lastUsed: diagnoses[0].lastUsed };
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
        lastUsed: data.lastUsed
      }))
      .sort((a, b) => b.count - a.count || new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime());

    res.json({ diagnoses: result });
  } catch (error) {
    console.error('Error fetching saved diagnoses:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getSavedSymptoms = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get all unique symptoms from this doctor's prescriptions
    const symptoms = await Prescription.aggregate([
      { $match: { doctorId: req.user._id } },
      { $unwind: '$diagnosis' },
      { $unwind: '$diagnosis.symptoms' },
      { 
        $group: { 
          _id: '$diagnosis.symptoms',
          count: { $sum: 1 },
          lastUsed: { $max: '$dateIssued' }
        } 
      },
      { $sort: { count: -1, lastUsed: -1 } },
      { 
        $project: { 
          _id: 0, 
          symptom: '$_id', 
          count: 1,
          lastUsed: 1
        } 
      }
    ]);

    res.json({ symptoms });
  } catch (error) {
    console.error('Error fetching saved symptoms:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getSavedTests = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get all unique tests from this doctor's prescriptions
    const tests = await Prescription.aggregate([
      { $match: { doctorId: req.user._id } },
      { $unwind: '$tests.orderedTests' },
      { 
        $group: { 
          _id: '$tests.orderedTests',
          count: { $sum: 1 },
          lastUsed: { $max: '$dateIssued' }
        } 
      },
      { $sort: { count: -1, lastUsed: -1 } },
      { 
        $project: { 
          _id: 0, 
          test: '$_id', 
          count: 1,
          lastUsed: 1
        } 
      }
    ]);

    res.json({ tests });
  } catch (error) {
    console.error('Error fetching saved tests:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getSavedMedicines = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get all unique medicines from this doctor's prescriptions
    const medicines = await Prescription.aggregate([
      { $match: { doctorId: req.user._id } },
      { $unwind: '$medications' },
      { 
        $group: { 
          _id: '$medications.name',
          count: { $sum: 1 },
          lastUsed: { $max: '$dateIssued' }
        } 
      },
      { $sort: { count: -1, lastUsed: -1 } },
      { 
        $project: { 
          _id: 0, 
          medicine: '$_id', 
          count: 1,
          lastUsed: 1
        } 
      }
    ]);

    res.json({ medicines });
  } catch (error) {
    console.error('Error fetching saved medicines:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};