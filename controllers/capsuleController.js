const { db, bucket } = require("../config/firebase");
const ResponseModel = require("../models/responseModel");
const Capsule = require("../models/capsule");
const { analyzeImage } = require("../services/roboflowService");
const { addAnomaliesToCapsule } = require("./anomaliesController");

// Agregar una nueva cápsula
const addCapsule = async (req, res) => {
    const { status } = req.body;

    try {
        // Crear una instancia de la cápsula
        const capsuleId = db.collection("capsules").doc().id; // Generar un ID único
        const capsule = new Capsule(capsuleId, status);

        // Guardar en Firestore
        await db.collection("capsules").doc(capsuleId).set(capsule.toObject());

        const response = new ResponseModel(true, [], null, 0, capsule.toObject());
        return res.status(200).json(response);
    } catch (error) {
        const response = new ResponseModel(false, [error.message], null, 500, null);
        return res.status(500).json(response);
    }
};

// Agregar imágenes para una cápsula existente
const addImagesForCapsule = async (req, res) => {
    const { capsuleId } = req.params;
    const { images } = req.body; // Suponemos que las imágenes vienen en el cuerpo de la solicitud

    try {
        // Verificar que las imágenes estén presentes
        if (!images || images.length === 0) {
            return res.status(400).json(new ResponseModel(false, ["No images provided"], null, 400, null));
        }

        // Buscar la cápsula en Firestore
        const capsuleDoc = await db.collection("capsules").doc(capsuleId).get();
        if (!capsuleDoc.exists) {
            return res.status(404).json(new ResponseModel(false, ["Capsule not found"], null, 404, null));
        }

        // Crear un batch para operaciones masivas
        const imageBatch = db.batch();
        const imageRefs = [];

        for (let i = 0; i < images.length; i++) {
            const { url, timestamp, frameNumber, location } = images[i];
            const imageBase64 = url.split(",")[1]; // Extraer la parte base64 de la URL
            const buffer = Buffer.from(imageBase64, "base64");

            // Crear un nombre único para la imagen en Storage con una estructura de carpetas
            const imageName = `capsule_images/${capsuleId}/${Date.now()}_frame${frameNumber}.jpg`;

            // Subir la imagen a Firebase Storage usando el bucket
            const file = bucket.file(imageName);
            await file.save(buffer, {
                metadata: { contentType: "image/jpeg" }
            });

            // Obtener la URL de descarga de la imagen
            const [imageUrl] = await file.getSignedUrl({
                action: "read",
                expires: "03-09-2491"
            });

            // Llamar al servicio de Roboflow para analizar la imagen
            const detectedAnomalies = await analyzeImage(imageUrl);
            console.log(detectedAnomalies);
            // Agregar anomalías detectadas a la cápsula
            if (detectedAnomalies.length > 0) {
                await addAnomaliesToCapsule(capsuleId, detectedAnomalies, timestamp.minutes, timestamp.seconds, frameNumber, location);
            }

            // Crear un documento de imagen en la subcolección "images"
            const imageRef = db.collection("capsules").doc(capsuleId).collection("images").doc();
            imageBatch.set(imageRef, {
                id: imageRef.id,
                url: imageUrl,
                timestamp: timestamp, // Asegúrate de que el timestamp esté bien formado
                frameNumber: frameNumber,
                location: location
            });
            imageRefs.push(imageRef.id);
        }

        // Ejecutar el batch
        await imageBatch.commit();

        // Responder con éxito
        const response = new ResponseModel(true, [], imageRefs, 0, null);
        return res.status(200).json(response);
    } catch (error) {
        // Manejar errores
        const response = new ResponseModel(false, [error.message], null, 500, null);
        return res.status(500).json(response);
    }
};

// Obtener todas las cápsulas
const getAllCapsules = async (req, res) => {
    try {
        const capsulesSnapshot = await db.collection("capsules").get();
        const capsules = capsulesSnapshot.docs.map(doc => {
            const data = doc.data();
            return new Capsule(doc.id, data.status).toObject();
        });

        const response = new ResponseModel(true, [], capsules, capsules.length, null);
        return res.status(200).json(response);
    } catch (error) {
        const response = new ResponseModel(false, [error.message], [], 500, null);
        return res.status(500).json(response);
    }
};

// Obtener una cápsula por ID
const getCapsuleById = async (req, res) => {
    const { capsuleId } = req.params;

    try {
        // Obtener la cápsula por ID
        const capsuleDoc = await db.collection("capsules").doc(capsuleId).get();

        if (!capsuleDoc.exists) {
            const response = new ResponseModel(false, ["Cápsula no encontrada"], [], 404, null);
            return res.status(404).json(response); // 404 - Not Found
        }

        const data = capsuleDoc.data();

        // Validar propiedades críticas
        const status = data.status || "Estado desconocido"; // Valor predeterminado

        // Obtener imágenes desde la subcolección
        const imagesSnapshot = await db.collection("capsules").doc(capsuleId).collection("images").get();

        // Inicializar arreglo de imágenes
        let images = [];
        if (!imagesSnapshot.empty) {
            images = imagesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } else {
            console.log(`No images found for capsule ${capsuleId}`);
        }

        // Crear instancia del modelo de cápsula
        const capsule = new Capsule(capsuleDoc.id, status, images);

        const response = new ResponseModel(true, [], null, 1, capsule.toObject());
        return res.status(200).json(response); // 200 - OK
    } catch (error) {
        console.error("Error retrieving capsule:", error);
        const response = new ResponseModel(false, [error.message], [], 500, null);
        return res.status(500).json(response); // 500 - Error interno
    }
};

module.exports = {
    addCapsule,
    addImagesForCapsule,
    getAllCapsules,
    getCapsuleById
};
