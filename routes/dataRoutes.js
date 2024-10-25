const express = require("express");
const router = express.Router();
const { db, bucket } = require("../config/firebase");
const { v4: uuidv4 } = require("uuid");

// POST route to upload image data
router.post("/", async (req, res) => {
    const { imageUrl, patientId, analysis } = req.body;

    try {
        const docRef = db.collection("endoscopyData").doc(uuidv4());
        await docRef.set({
            imageUrl,
            patientId,
            analysis,
            timestamp: new Date()
        });

        res.status(201).json({ message: "Data saved successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error saving data" });
    }
});

// Route to upload images to Firebase Storage
router.post("/upload", upload.single("image"), async (req, res) => {
    const file = req.file;
    const fileName = `${Date.now()}-${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
        metadata: {
            contentType: file.mimetype
        }
    });

    stream.on("error", err => {
        res.status(500).json({ error: err.message });
    });

    stream.on("finish", async () => {
        await fileUpload.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
        res.status(200).json({ imageUrl: publicUrl });
    });

    stream.end(file.buffer);
});

module.exports = router;
