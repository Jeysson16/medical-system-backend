const express = require("express");
const bodyParser = require("body-parser");
const path = require("path"); // Importar path para manejar rutas
const app = express();

const patientsRoutes = require("./routes/patientsRoutes");
const capsulesRoutes = require("./routes/capsulesRoutes");
const diagnosticRoutes = require("./routes/diagnosticsRoutes");
const anomaliesRoutes = require("./routes/anomaliesRoutes");

// Configurar Express para usar JSON y body-parser con límites aumentados
app.use(express.json());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

// Rutas de la API
app.use("/api/patients", patientsRoutes);
app.use("/api/capsules", capsulesRoutes);
app.use("/api/diagnostic", diagnosticRoutes);
app.use("/api/anomalies", anomaliesRoutes);

// Ruta principal para servir el archivo HTML
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Exportar la aplicación para Vercel
module.exports = app;
