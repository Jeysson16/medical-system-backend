require("dotenv").config(); // Inicializa dotenv

const admin = require("firebase-admin");

// Cargar la variable de entorno
const serviceAccountEnv = process.env.FIREBASE_ADMIN_SDK;

if (!serviceAccountEnv) {
    throw new Error("FIREBASE_ADMIN_SDK environment variable is not set or invalid.");
}

let serviceAccount;
try {
    // Intenta parsear como JSON si comienza con "{"
    if (serviceAccountEnv.trim().startsWith("{")) {
        serviceAccount = JSON.parse(serviceAccountEnv);
    } else {
        // Si no es JSON, asume que es una ruta de archivo
        serviceAccount = require(serviceAccountEnv);
    }
} catch (e) {
    console.error("Error parsing FIREBASE_ADMIN_SDK:", e.message);
    throw new Error("FIREBASE_ADMIN_SDK is not a valid JSON or file path.");
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "capsule-852e9.appspot.com"
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { db, bucket };
