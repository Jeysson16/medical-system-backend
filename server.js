const express = require("express");
const app = express();
const patientsRoutes = require("./routes/patientsRoutes");
const capsulesRoutes = require("./routes/capsulesRoutes");
const diagnosticRoutes = require("./routes/diagnosticsRoutes");

app.use(express.json());

// Usar las rutas definidas
app.use("/api/patients", patientsRoutes);
app.use("/api/capsules", capsulesRoutes);
app.use("/api/diagnostic", diagnosticRoutes);
app.use("/api/anomalies", anomaliesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
