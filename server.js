const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const patientsRoutes = require("./routes/patientsRoutes");
const capsulesRoutes = require("./routes/capsulesRoutes");
const diagnosticRoutes = require("./routes/diagnosticsRoutes");
const anomaliesRoutes = require("./routes/anomaliesRoutes");

app.use(express.json());

// Increase limit to 50mb (adjust as needed)
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
// Usar las rutas definidas
app.use("/api/patients", patientsRoutes);
app.use("/api/capsules", capsulesRoutes);
app.use("/api/diagnostic", diagnosticRoutes);
app.use("/api/anomalies", anomaliesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
