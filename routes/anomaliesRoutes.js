const express = require("express");
const router = express.Router();
const anomaliesController = require("../controllers/anomaliesController");

// Ruta para obtener todas las anomalías
router.get("/getAll", anomaliesController.getAnomalies);

module.exports = router;
