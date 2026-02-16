"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const patientController_1 = require("../controllers/patientController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All patient routes require authentication
router.use(auth_1.authenticateToken);
// GET /api/patients - Get all patients for authenticated doctor
router.get('/', patientController_1.getPatients);
// POST /api/patients - Create a new patient
router.post('/', patientController_1.createPatient);
// GET /api/patients/:id - Get specific patient by ID
router.get('/:id', patientController_1.getPatientById);
// PUT /api/patients/:id - Update patient
router.put('/:id', patientController_1.updatePatient);
// DELETE /api/patients/:id - Delete patient
router.delete('/:id', patientController_1.deletePatient);
exports.default = router;
