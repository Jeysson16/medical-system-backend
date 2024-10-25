const express = require("express");
const router = express.Router();
const patientsController = require("../controllers/patientsController");

// Endpoint para agregar un nuevo paciente
router.post("/", patientsController.addPatient);

// Endpoint para agregar un diagnóstico a un paciente específico
router.post("/:patientId/diagnostics", patientsController.addDiagnostic);

// Endpoint para obtener los diagnósticos de un paciente
router.get("/:patientId/diagnostics", patientsController.getPatientDiagnostics);

module.exports = router;
