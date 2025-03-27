const jwt = require('jsonwebtoken');
const userModel = require('../models/UserModel');  // Assure-toi que le modèle User est bien importé

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
        req.user = decoded;  // Stocker les données décodées dans req.user

        // Extraire l'ID utilisateur du token
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ error: "Utilisateur non trouvé dans le token" });
        }

        // Récupérer l'utilisateur dans la BDD à partir de l'ID
        const user = await userModel.findOne({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        // Attacher l'utilisateur récupéré à la requête
        req.userDetails = user;
        next();  // Passer à la route suivante
    } catch (error) {
        return res.status(401).json({ error: "Token invalide" });
    }
};

module.exports = authenticateUser;
