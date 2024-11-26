const admin = require("firebase-admin");

try {
    console.log("Initializing Firebase...");
    const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK);
    console.log("Service Account Loaded:", serviceAccount);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: "your-project-id.appspot.com"
    });

    console.log("Firebase Initialized");
} catch (error) {
    console.error("Firebase Initialization Error:", error);
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { db, bucket };
