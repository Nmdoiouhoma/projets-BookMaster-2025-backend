const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/UserModel');
require('dotenv').config();

// Configurer le transporteur Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 1. Demande de réinitialisation de mot de passe
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const resetLink = `${req.protocol}://${req.get('host')}/reset-password?token=${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Réinitialisation du mot de passe',
            html: `<p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe :</p>
                   <a href="${resetLink}">${resetLink}</a>`
        });

        res.json({ message: "E-mail de réinitialisation envoyé." });
    } catch (error) {
        console.error("Erreur dans forgotPassword :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// 2. Réinitialisation du mot de passe
// Fonction pour réinitialiser le mot de passe
exports.resetPassword = async (req, res) => {
    const { token } = req.query;  // On récupère le token depuis l'URL
    const { password } = req.body;

    if (!token) {
        return res.status(400).json({ message: "Token manquant ou invalide" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        // Hash du mot de passe avant de le stocker
        user.password = await bcrypt.hash(password, 10);
        await user.save();

        res.json({ message: "Mot de passe réinitialisé avec succès." });
    } catch (error) {
        console.error("Erreur dans resetPassword :", error);
        res.status(500).json({ message: "Lien invalide ou expiré", error: error.message });
    }
};








