import express from 'express';
import {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
  getSavedDiagnoses,
  getSavedSymptoms,
  addSavedSymptom,
  getSavedTests,
  getSavedMedicines,
} from '../controllers/prescriptionController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.post('/', createPrescription);
router.get('/', getPrescriptions);
router.get('/saved-diagnoses', getSavedDiagnoses);
router.get('/saved-symptoms', getSavedSymptoms);
router.post('/saved-symptoms', addSavedSymptom);
router.get('/saved-tests', getSavedTests);
router.get('/saved-medicines', getSavedMedicines);
router.get('/:id', getPrescriptionById);
router.put('/:id', updatePrescription);
router.delete('/:id', deletePrescription);

export default router;
