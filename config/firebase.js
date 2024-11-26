const admin = require("firebase-admin");

try {
    console.log("Initializing Firebase...");
    const serviceAccount = {
        apiKey: "AIzaSyD-uzdVngolTs-quZgL_kY-Mb4uoyFBtOA",
        authDomain: "capsule-852e9.firebaseapp.com",
        projectId: "capsule-852e9",
        storageBucket: "capsule-852e9.appspot.com",
        messagingSenderId: "547809404822",
        appId: "1:547809404822:web:c7778452587072c5765fb7",
        measurementId: "G-GNXJVDX3RY"
    };
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
