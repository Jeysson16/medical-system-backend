const express = require("express");
const app = express();
const patientsRoutes = require("./routes/patientsRoutes");
const doctorsRoutes = require("./routes/doctorsRoutes");
const capsulesRoutes = require("./routes/capsulesRoutes");

app.use(express.json());

// Usar las rutas definidas
app.use("/api/patients", patientsRoutes);
app.use("/api/doctors", doctorsRoutes);
app.use("/api/capsules", capsulesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
