const express = require("express");
const router = express.Router();
const { addDiagnostic, getDiagnosticsByCapsule } = require("../controllers/diagnosticController");

// Rutas para los diagnósticos
router.post("/:capsuleId", addDiagnostic); // Agregar diagnóstico a una cápsula
router.get("/:capsuleId", getDiagnosticsByCapsule); // Obtener diagnósticos de una cápsula

module.exports = router;
