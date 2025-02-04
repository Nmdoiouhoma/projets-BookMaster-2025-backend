// Charger dotenv pour les variables d'environnement
require('dotenv').config();

const cors = require('cors');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const Database = require("./config/database");
const UserModel = require("./models/UserModel");

app.use(express.json());
app.use(cors());

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.send('Page d\'accueil - BookMaster');
});

// Route GET pour récupérer tous les utilisateurs
app.get('/users', async (req, res) => {
    try {
        const users = await UserModel.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

app.post('/users', async (req, res) => {
    const { name, email, password, username, lastname, avatar } = req.body;

    // Vérifier que tous les champs obligatoires sont fournis
    if (!name || !email || !password || !username || !lastname) {
        return res.status(400).json({
            error: 'Les champs name, email, password, username, lastName sont obligatoires'
        });
    }
    try {
        // Création de l'utilisateur dans la base de données
        const newUser = await UserModel.create({ name, email, password, username, lastname, avatar });
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});


// Route PATCH pour mettre à jour un utilisateur
app.patch('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email,lastname, username, avatar} = req.body;

    // Vérifier qu'au moins un champ est fourni pour la mise à jour
    if (!name && !email && !lastname && !username && !avatar) {
        return res.status(400).json({ error: 'Erreur: aucun des champs n\'a été saisi' });
    }
    try {
        // Met à jour uniquement les champs fournis
        await UserModel.update(
            { name, email,lastname,username, avatar}, // Ces valeurs seront ignorées si elles sont undefined
            { where: { id } }
        );

        // Récupérer l'utilisateur mis à jour pour le renvoyer
        const updatedUser = await UserModel.findByPk(id);
        if (!updatedUser) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// Route DELETE pour supprimer un utilisateur
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Supprime l'utilisateur dont l'id correspond
        const deleted = await UserModel.destroy({ where: { id } });

        if (deleted) {
            res.status(200).json({ message: `Utilisateur avec l'id ${id} supprimé` });
        } else {
            res.status(404).json({ error: "Utilisateur non trouvé" });
        }
    } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// Démarrer la connexion à la base de données et le serveur
const dbStart = async () => {
    try {
        await new Database().connect();
        app.listen(port, () => {
            console.log(`Serveur démarré sur le port ${port}`);
        });
        await UserModel.sync({ alter: true });
    } catch (error) {
        console.error("Erreur lors du démarrage de l'application :", error);
    }
};

dbStart();
