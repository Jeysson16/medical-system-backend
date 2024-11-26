const express = require("express");
const router = express.Router();
const { addCapsule, getCapsuleById, addImagesForCapsule } = require("../controllers/capsuleController");

// Rutas para las cápsulas
router.post("/insert", addCapsule); // Agregar cápsula
router.post("/insertImages/:capsuleId", addImagesForCapsule); // Agregar Imagen a cápsula
router.get("/:capsuleId", getCapsuleById); // Obtener cápsula por ID

module.exports = router;
