const admin = require("firebase-admin");

// Parsear las credenciales desde una variable de entorno
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "capsule-852e9.appspot.com"
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { db, bucket };
