const express = require("express");
const router = express.Router();
const anomaliesController = require("../controllers/anomaliesController");

// Ruta para crear una nueva anomalía
router.post("/insert", anomaliesController.addAnomaly);

// Ruta para obtener todas las anomalías
router.get("/getAll", anomaliesController.getAnomalies);

module.exports = router;
