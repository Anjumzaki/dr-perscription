import express from 'express';
import { 
  createPatient, 
  getPatients, 
  getPatientById, 
  updatePatient, 
  deletePatient 
} from '../controllers/patientController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All patient routes require authentication
router.use(authenticateToken);

// GET /api/patients - Get all patients for authenticated doctor
router.get('/', getPatients);

// POST /api/patients - Create a new patient
router.post('/', createPatient);

// GET /api/patients/:id - Get specific patient by ID
router.get('/:id', getPatientById);

// PUT /api/patients/:id - Update patient
router.put('/:id', updatePatient);

// DELETE /api/patients/:id - Delete patient
router.delete('/:id', deletePatient);

export default router;