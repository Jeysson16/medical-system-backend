const { db } = require("../config/firebase");
const Anomaly = require("../models/anomaly");
const ResponseModel = require("../models/responseModel");

// Controlador para agregar una nueva anomalía
const addAnomaly = async (req, res) => {
    const { capsuleId, description, severity, time, location } = req.body;

    try {
        const anomalyRef = db.collection("anomalies").doc(); // Creamos un documento en la colección de anomalías
        const newAnomaly = new Anomaly(
            anomalyRef.id,
            capsuleId,
            description,
            severity,
            time,
            location,
            new Date() // Fecha y hora actuales de la detección
        );

        // Guardamos la anomalía en Firestore
        await anomalyRef.set(newAnomaly.toObject());

        const response = new ResponseModel(true, [], [], 0, newAnomaly);
        return res.status(201).json(response); // 201 - Creado
    } catch (error) {
        const response = new ResponseModel(false, [error.message], [], 500, null);
        return res.status(500).json(response); // 500 - Error interno
    }
};

// Controlador para obtener todas las anomalías
const getAnomalies = async (req, res) => {
    try {
        const anomaliesSnapshot = await db.collection("anomalies").get();
        const anomalies = anomaliesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const response = new ResponseModel(true, [], anomalies, anomalies.length, null);
        return res.status(200).json(response); // 200 - OK
    } catch (error) {
        const response = new ResponseModel(false, [error.message], [], 500, null);
        return res.status(500).json(response); // 500 - Error interno
    }
};

module.exports = {
    addAnomaly,
    getAnomalies
};
