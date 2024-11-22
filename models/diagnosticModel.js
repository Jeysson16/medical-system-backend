class Diagnostic {
    constructor(id, capsuleId, analysis, recommendations, createdAt) {
        this.id = id; // ID único del diagnóstico
        this.capsuleId = capsuleId; // ID de la cápsula asociada
        this.analysis = analysis; // Análisis realizado
        this.recommendations = recommendations; // Recomendaciones basadas en el análisis
        this.createdAt = createdAt || new Date(); // Fecha de creación del diagnóstico
    }

    // Método opcional para representar el diagnóstico como objeto
    toObject() {
        return {
            id: this.id,
            capsuleId: this.capsuleId,
            analysis: this.analysis,
            recommendations: this.recommendations,
            createdAt: this.createdAt
        };
    }
}

module.exports = Diagnostic;
