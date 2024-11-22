const { db } = require("../config/firebase");
const ResponseModel = require("../models/responseModel");

// Agregar una nueva cápsula
const addCapsule = async (req, res) => {
    const { name, description } = req.body;

    try {
        const capsuleRef = db.collection("capsules").doc();
        await capsuleRef.set({
            name,
            description,
            createdAt: new Date()
        });

        const response = new ResponseModel(true, [], [], 0, { capsuleId: capsuleRef.id, name, description });
        return res.status(201).json(response);
    } catch (error) {
        const response = new ResponseModel(false, [error.message], [], 500, null);
        return res.status(500).json(response);
    }
};

// Obtener todas las cápsulas
const getAllCapsules = async (req, res) => {
    try {
        const capsulesSnapshot = await db.collection("capsules").get();
        const capsules = capsulesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

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
        const capsuleDoc = await db.collection("capsules").doc(capsuleId).get();

        if (!capsuleDoc.exists) {
            const response = new ResponseModel(false, ["Cápsula no encontrada"], [], 404, null);
            return res.status(404).json(response);
        }

        const response = new ResponseModel(true, [], capsuleDoc.data(), 1, null);
        return res.status(200).json(response);
    } catch (error) {
        const response = new ResponseModel(false, [error.message], [], 500, null);
        return res.status(500).json(response);
    }
};

module.exports = {
    addCapsule,
    getAllCapsules,
    getCapsuleById
};
