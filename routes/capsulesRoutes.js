const express = require("express");
const router = express.Router();
const { addCapsule, getAllCapsules, getCapsuleById } = require("../controllers/capsuleController");

// Rutas para las cápsulas
router.post("/", addCapsule); // Agregar cápsula
router.get("/", getAllCapsules); // Obtener todas las cápsulas
router.get("/:capsuleId", getCapsuleById); // Obtener cápsula por ID

module.exports = router;
