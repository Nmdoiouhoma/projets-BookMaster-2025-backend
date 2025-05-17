const jwt = require('jsonwebtoken');
const userModel = require('../models/UserModel');
const multer = require("multer");
const path = require("path");

// Clé secrète pour vérifier le JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const authenticateUser = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: "Accès refusé. Token manquant" });
    }

    try {
        // Vérifier et décoder le token
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("✅ Token décodé :", decoded)
        req.user = decoded;  // Stocker les données décodées dans req.user

        // Extraire l'ID utilisateur du token
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ error: "Utilisateur non trouvé dans le token" });
        }

        const user = await userModel.findOne({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }
        req.userDetails = user;
        next();  // Passer à la route suivante
    } catch (error) {
        return res.status(401).json({ error: "Token invalide" });
    }

// 📂 Configuration de Multer pour stocker les avatars
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "public/uploads/avatars"); // 📁 Dossier où seront stockés les avatars
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname)); // Génère un nom unique
        }
    });

    const upload = multer({ storage: storage });
};

module.exports = authenticateUser;
