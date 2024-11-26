const axios = require("axios");

/**
 * Envía una imagen a Roboflow para su análisis y extrae las anomalías relevantes.
 * @param {string} imageUrl - URL de la imagen almacenada.
 * @returns {Promise<Array>} - Lista de anomalías clasificadas como B, D, E, o K, con confianza > 60%.
 */
const analyzeImage = async imageUrl => {
    try {
        const { apiKey, baseUrl, model } = require("../config/roboflow");
        const modelUrl = `${baseUrl}/${model.id}/${model.version}`;

        // Descarga la imagen desde la URL y conviértela a Base64
        const responseImage = await axios.get(imageUrl, {
            responseType: "arraybuffer"
        });
        const imageBase64 = Buffer.from(responseImage.data, "binary").toString("base64");

        // Enviar la solicitud a Roboflow
        const response = await axios({
            method: "POST",
            url: modelUrl,
            params: {
                api_key: apiKey
            },
            data: imageBase64,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        // Acceder al campo "predictions" de la respuesta
        const predictions = response.data.predictions;

        // Validar que "predictions" exista y sea un array
        if (!Array.isArray(predictions)) {
            throw new Error("El campo 'predictions' no está presente o no es un array.");
        }

        // Filtrar las anomalías por clases específicas (B, D, E, K) y confianza > 60%
        const relevantAnomalies = predictions
            .filter(pred => ["B", "D", "E", "K"].includes(pred.class) && pred.confidence > 0.6)
            .map(pred => ({
                description: getAnomalyDescription(pred.class),
                confidence: pred.confidence,
                position: { x: pred.x, y: pred.y },
                dimensions: { width: pred.width, height: pred.height },
                class: pred.class,
                detectionId: pred.detection_id
            }));

        return relevantAnomalies;
    } catch (error) {
        console.error("Error al analizar la imagen con Roboflow:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw new Error("Failed to analyze image with Roboflow.");
    }
};

/**
 * Retorna una descripción detallada de la anomalía basada en su clase.
 * @param {string} anomalyClass - Clase de la anomalía.
 * @returns {string} - Descripción de la anomalía.
 */
const getAnomalyDescription = anomalyClass => {
    const descriptions = {
        A: "Variación leve en el estado celular.",
        B: "Células benignas o un primer nivel de desviación de la normalidad.",
        D: "Lesión o Herida.",
        E: "Llaga o Úlcera.",
        K: "Pseudomembranas o placas blancas, probablemente debido a una infección fúngica, bacteriana, o afecciones relacionadas con cálculos o cristales."
    };
    return descriptions[anomalyClass] || "Clase de anomalía no especificada.";
};

module.exports = {
    analyzeImage
};
