const jwt = require('jsonwebtoken');

// Clé secrète pour vérifier le JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware pour vérifier le token JWT
const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: "Accès refusé. Token manquant" });
    }

    try {
        // Vérifier et décoder le token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;  // Stocker les données utilisateur décodées dans `req.user`
        next();  // Passer à la route suivante
    } catch (error) {
        return res.status(401).json({ error: "Token invalide" });
    }
};

module.exports = authenticateUser;
