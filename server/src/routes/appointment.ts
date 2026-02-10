import express from 'express';
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment
} from '../controllers/appointmentController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Protect all routes
router.use(authenticateToken);

router.get('/', getAppointments);          // GET /api/appointments
router.post('/', createAppointment);       // POST /api/appointments
router.put('/:id', updateAppointment);     // PUT /api/appointments/:id
router.delete('/:id', deleteAppointment);  // DELETE /api/appointments/:id

export default router;
