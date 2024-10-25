const { db } = require("../config/firebase");
const ResponseModel = require("../models/responseModel");

// Controlador para agregar un nuevo paciente
const addPatient = async (req, res) => {
    const { name, age, medicalHistory } = req.body;

    try {
        const patientRef = db.collection("patients").doc();
        await patientRef.set({
            name,
            age,
            medicalHistory,
            createdAt: new Date()
        });

        const response = new ResponseModel(true, [], [], 0, { patientId: patientRef.id, name, age, medicalHistory });
        return res.status(201).json(response);
    } catch (error) {
        const response = new ResponseModel(false, [error.message], [], 500, null);
        return res.status(500).json(response);
    }
};

// Controlador para agregar un diagnóstico a un paciente específico
const addDiagnostic = async (req, res) => {
    const { patientId } = req.params;
    const { analysis, recommendations } = req.body;

    try {
        const diagnosticRef = db.collection("patients").doc(patientId).collection("diagnostics").doc();
        await diagnosticRef.set({
            analysis,
            recommendations,
            createdAt: new Date()
        });

        const response = new ResponseModel(true, [], [], 0, { diagnosticId: diagnosticRef.id, analysis, recommendations });
        return res.status(201).json(response);
    } catch (error) {
        const response = new ResponseModel(false, [error.message], [], 500, null);
        return res.status(500).json(response);
    }
};

// Controlador para obtener los diagnósticos de un paciente
const getPatientDiagnostics = async (req, res) => {
    const { patientId } = req.params;

    try {
        const diagnosticsSnapshot = await db.collection("patients").doc(patientId).collection("diagnostics").get();
        const diagnostics = diagnosticsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const response = new ResponseModel(true, [], diagnostics, diagnostics.length, null);
        return res.status(200).json(response);
    } catch (error) {
        const response = new ResponseModel(false, [error.message], [], 500, null);
        return res.status(500).json(response);
    }
};

module.exports = {
    addPatient,
    addDiagnostic,
    getPatientDiagnostics
};
