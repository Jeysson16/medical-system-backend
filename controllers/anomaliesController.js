const { db } = require("../config/firebase");
const Anomaly = require("../models/anomaly");
const ResponseModel = require("../models/responseModel");

// Controlador para agregar una nueva anomalía
const addAnomaliesToCapsule = async (capsuleId, detectedAnomalies, minutes, seconds, frameNumber, location) => {
    try {
        // Responder inmediatamente al cliente
        setImmediate(async () => {
            const capsuleRef = db.collection("capsules").doc(capsuleId);
            const anomalyBatch = db.batch();

            const hours = Math.floor(minutes / 60);
            minutes = minutes % 60;

            // Procesar cada anomalía detectada
            detectedAnomalies.forEach(anomaly => {
                const anomalyRef = capsuleRef.collection("anomalies").doc();

                const newAnomaly = new Anomaly(
                    anomalyRef.id,
                    capsuleId,
                    anomaly.description,
                    anomaly.confidence,
                    {
                        hours: hours,
                        minutes: minutes,
                        seconds: seconds,
                        frames: frameNumber
                    },
                    location,
                    new Date()
                );

                // Agregar la anomalía al batch
                anomalyBatch.set(anomalyRef, newAnomaly.toObject());
            });

            // Ejecutar todas las operaciones en el batch
            await anomalyBatch.commit();
        });

        // Respuesta inmediata
        return new ResponseModel(true, [], null, 0, null);
    } catch (error) {
        return new ResponseModel(false, [error], null, 0, null);
    }
};

// Controlador para obtener todas las anomalías
const getAnomalies = async (req, res) => {
    try {
        // Obtener el ID de la cápsula desde los parámetros de la solicitud
        const { capsuleId } = req.params;

        if (!capsuleId) {
            const response = new ResponseModel(false, ["Capsule ID is required"], [], 400, null);
            return res.status(400).json(response); // 400 - Bad Request
        }

        // Referencia a las anomalías de la cápsula específica
        const anomaliesSnapshot = await db.collection("capsules").doc(capsuleId).collection("anomalies").get();

        if (anomaliesSnapshot.empty) {
            const response = new ResponseModel(true, [], [], 0, null);
            return res.status(200).json(response); // 200 - OK, pero sin resultados
        }

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
    addAnomaliesToCapsule,
    getAnomalies
};
