class Capsule {
    constructor(id, type, creationDate, status, data) {
        this.id = id; // ID único de la cápsula
        this.status = status || "active"; // Estado de la cápsula (e.g., "active", "inactive")
        this.images = images; // Arreglo de imágenes con sus URLs y tiempos
    }

    // Método opcional para representar la cápsula como objeto
    toObject() {
        return {
            id: this.id,
            status: this.status,
            images: this.images
        };
    }
}

module.exports = Capsule;
