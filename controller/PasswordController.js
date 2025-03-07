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

        const resetLink = `${req.protocol}://${req.get('host')}/reset-password/${token}`;

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

exports.getResetPasswordPage = async (req, res) => {
    const { token } = req.params;

    try {
        // Vérification du token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Si le token est valide, on envoie la page HTML avec le cookie
        res.cookie('resetToken', token, { secure: true, maxAge: 60 * 60 * 1000 }); // Expires in 1 hour
        res.redirect('http://localhost:63342/BookMaster-2025/projets-BookMaster-2025-frontend/public/reset-password.html');
    } catch (error) {
        // Si le token est invalide ou expiré
        return res.status(400).json({ message: 'Token invalide ou expiré.' });
    }
};

exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
        return res.status(400).json({ message: "Token manquant ou invalide" });
    }

    try {
        // Vérification du token
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








