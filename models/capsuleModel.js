class Capsule {
    constructor(id, type, creationDate, status, data) {
        this.id = id; // ID único de la cápsula
        this.type = type; // Tipo de cápsula (e.g., "environmental", "medical")
        this.creationDate = creationDate || new Date(); // Fecha de creación
        this.status = status || "active"; // Estado de la cápsula (e.g., "active", "inactive")
        this.data = data || {}; // Datos asociados con la cápsula (puede ser un objeto para diferentes valores)
    }

    // Método opcional para representar la cápsula como objeto
    toObject() {
        return {
            id: this.id,
            type: this.type,
            creationDate: this.creationDate,
            status: this.status,
            data: this.data
        };
    }
}

module.exports = Capsule;
