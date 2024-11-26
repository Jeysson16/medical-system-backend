class Anomaly {
    constructor(id, capsuleId, description, severity, time, location, detectedAt) {
        this.id = id; // ID único de la anomalía
        this.capsuleId = capsuleId; // ID de la cápsula asociada
        this.description = description; // Descripción de la anomalía detectada
        this.severity = severity; // Gravedad de la anomalía (ejemplo: "Alta", "Media", "Baja")
        this.time = time || { hours: null, minutes: null, seconds: null, frames: null }; // Hora específica de la detección
        this.location = location; // Ubicación de la detección (puede incluir latitud, longitud o descripción)
        this.detectedAt = detectedAt || new Date(); // Fecha y hora completa de la detección
    }

    // Método para representar la anomalía como objeto
    toObject() {
        return {
            id: this.id,
            capsuleId: this.capsuleId,
            description: this.description,
            severity: this.severity,
            time: this.time,
            location: this.location,
            detectedAt: this.detectedAt
        };
    }
}

module.exports = Anomaly;
