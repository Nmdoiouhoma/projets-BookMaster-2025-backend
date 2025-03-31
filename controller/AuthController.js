const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/UserModel'); // Assure-toi que le modèle User est bien importé
const { Op } = require('sequelize');

// Clé secrète pour signer les JWT (toujours garder ceci privé)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Fonction pour l'inscription (signup) d'un utilisateur
const createUser = async (req, res) => {
    const { email, name, password, username,avatar,lastname } = req.body;  // Ajout de 'username' ici

    try {
        // Vérifier si un utilisateur avec cet email existe déjà, y compris les utilisateurs supprimés (soft deleted)
        const existingUser = await userModel.findOne({
            where: { email, deletedAt: { [Op.is]: null } }  // Vérifie si l'email existe et ignore les utilisateurs soft deleted
        });

        if (existingUser) {
            return res.status(400).json({ error: "Cet email est déjà utilisé" });
        }

        // Vérifier si le username est déjà utilisé
        const existingUsername = await userModel.findOne({
            where: { username, deletedAt: { [Op.is]: null } }
        });

        if (existingUsername) {
            return res.status(400).json({ error: "Ce nom d'utilisateur est déjà pris" });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création de l'utilisateur dans la base de données
        const newUser = await userModel.create({
            email,
            name,
            username,
            lastname,
            avatar,
            password: hashedPassword
        });

        // Générer un access token (JWT)
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email },  // Contenu du JWT : l'ID et l'email
            JWT_SECRET,  // Clé secrète
            { expiresIn: '1d' }  // Le token expire dans 1 jour
        );

        // Réponse de succès avec le token JWT
        res.status(201).json({
            message: "Utilisateur créé avec succès",
            token  // Ajouter le token dans la réponse
        });
    } catch (error) {
        console.error("Erreur lors de l'inscription de l'utilisateur :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

// Fonction pour la connexion (login) de l'utilisateur
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Vérifier si l'utilisateur existe dans la base de données
        const user = await userModel.findOne({  // Utilisation de userModel ici
            where: { username, deletedAt: { [Op.is]: null } }  // Ignore les utilisateurs soft deleted
        });

        if (!user) {
            return res.status(400).json({ error: "Nom d'utilisateur ou mot de passe invalide" });
        }
        // Comparer les mots de passe (le mot de passe fourni avec le mot de passe stocké)
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: "Nom d'utilisateur ou mot de passe invalide" });
        }
        // Générer un access token (JWT)
        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '1d' },
        );

        // Réponse de succès avec le token JWT
        res.status(200).json({
            message: "Connexion réussie",
            token
        });
    } catch (error) {
        console.error("Erreur lors de la connexion de l'utilisateur :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

module.exports = {
    createUser,  // Exporter la méthode d'inscription
    loginUser    // Exporter la méthode de connexion
};
