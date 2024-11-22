const { db } = require("../config/firebase");
const ResponseModel = require("../models/responseModel");

// Agregar un diagnóstico a una cápsula específica
const addDiagnostic = async (req, res) => {
    const { capsuleId } = req.params;
    const { analysis, recommendations } = req.body;

    try {
        const diagnosticRef = db.collection("capsules").doc(capsuleId).collection("diagnostics").doc();
        await diagnosticRef.set({
            analysis,
            recommendations,
            createdAt: new Date()
        });

        const response = new ResponseModel(true, [], [], 0, { diagnosticId: diagnosticRef.id, analysis, recommendations });
        return res.status(200).json(response);
    } catch (error) {
        const response = new ResponseModel(false, [error.message], [], 500, null);
        return res.status(500).json(response);
    }
};

// Obtener todos los diagnósticos de una cápsula
const getDiagnosticsByCapsule = async (req, res) => {
    const { capsuleId } = req.params;

    try {
        const diagnosticsSnapshot = await db.collection("capsules").doc(capsuleId).collection("diagnostics").get();
        const diagnostics = diagnosticsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const response = new ResponseModel(true, [], diagnostics, diagnostics.length, null);
        return res.status(200).json(response);
    } catch (error) {
        const response = new ResponseModel(false, [error.message], [], 500, null);
        return res.status(500).json(response);
    }
};

module.exports = {
    addDiagnostic,
    getDiagnosticsByCapsule
};
