import { Request, Response } from 'express';
import Patient from '../models/Patient';
import { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

export const createPatient = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const { name, age, gender, phone, email, address, emergencyContact } = req.body;

    // Check if patient with same phone number already exists for this doctor
    const existingPatient = await Patient.findOne({ 
      doctorId: req.user!._id, 
      phone 
    });

    if (existingPatient) {
      return res.status(400).json({ 
        message: 'A patient with this phone number already exists' 
      });
    }

    const patient = new Patient({
      name,
      age,
      gender,
      phone,
      email,
      address,
      emergencyContact,
      doctorId: req.user!._id
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
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getPatients = async (req: AuthRequest, res: Response) => {
  try {
    const { search, limit = 50, page = 1 } = req.query;

    let query: any = { doctorId: req.user!._id };

    // Add search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const patients = await Patient.find(query)
      .sort({ updatedAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .select('-doctorId -__v');

    const total = await Patient.countDocuments(query);

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
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt
      })),
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getPatientById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findOne({ 
      _id: id, 
      doctorId: req.user!._id 
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
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updatePatient = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, age, gender, phone, email, address, emergencyContact } = req.body;

    // Check if patient exists and belongs to this doctor
    const patient = await Patient.findOne({ 
      _id: id, 
      doctorId: req.user!._id 
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if phone number is being changed and if it conflicts with another patient
    if (phone !== patient.phone) {
      const existingPatient = await Patient.findOne({ 
        doctorId: req.user!._id, 
        phone,
        _id: { $ne: id }
      });

      if (existingPatient) {
        return res.status(400).json({ 
          message: 'A patient with this phone number already exists' 
        });
      }
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      {
        name,
        age,
        gender,
        phone,
        email,
        address,
        emergencyContact
      },
      { new: true, runValidators: true }
    ).select('-doctorId -__v');

    res.json({
      message: 'Patient updated successfully',
      patient: {
        id: updatedPatient!._id,
        name: updatedPatient!.name,
        age: updatedPatient!.age,
        gender: updatedPatient!.gender,
        phone: updatedPatient!.phone,
        email: updatedPatient!.email,
        address: updatedPatient!.address,
        emergencyContact: updatedPatient!.emergencyContact,
        createdAt: updatedPatient!.createdAt,
        updatedAt: updatedPatient!.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deletePatient = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findOneAndDelete({ 
      _id: id, 
      doctorId: req.user!._id 
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};