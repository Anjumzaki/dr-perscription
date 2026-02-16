"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appointmentController_1 = require("../controllers/appointmentController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Protect all routes
router.use(auth_1.authenticateToken);
router.get('/', appointmentController_1.getAppointments); // GET /api/appointments
router.post('/', appointmentController_1.createAppointment); // POST /api/appointments
router.put('/:id', appointmentController_1.updateAppointment); // PUT /api/appointments/:id
router.delete('/:id', appointmentController_1.deleteAppointment); // DELETE /api/appointments/:id
exports.default = router;
