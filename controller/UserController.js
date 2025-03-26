const UserModel = require('../models/UserModel');
const BookModel = require('../models/BookModel');

class UserController {
    constructor() {}

    // Page d'accueil
    getHomePage = async (req, res) => {
        res.send("Page d'accueil - BookMaster");
    };

    // Récupérer tous les utilisateurs
    getAllUsers = async (req, res, next) => {
        try {
            const users = await UserModel.findAll(); // Trouver tous les utilisateurs
            if (users.length === 0) {
                return res.status(404).json({ error: "Aucun utilisateur trouvé" });
            }
            res.status(200).json(users); // Renvoie les utilisateurs
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs :", error);
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    };

    // Récupérer un utilisateur par ID
    getOneUser = async (req, res, next) => {
        try {
            const user = await UserModel.findOne({
                where: { id: req.params.id },
            });
            if (!user) {
                return res.status(404).json({ error: "Utilisateur non trouvé" });
            }
            res.status(200).json(user);
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur :", error);
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    };

    // Supprimer un utilisateur
    deleteUser = async (req, res, next) => {
        const { id } = req.params;
        try {
            const deleted = await UserModel.destroy({
                where: { id },
                force: true  // Cette option force la suppression physique
            });
            if (deleted) {
                res.status(200).json({ message: `Utilisateur avec l'ID ${id} supprimé` });
            } else {
                res.status(404).json({ error: "Utilisateur non trouvé" });
            }
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur :", error);
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    };


    // Mettre à jour un utilisateur
    updateUser = async (req, res, next) => {
        const { id } = req.params;
        const { name, email, lastname, username, avatar } = req.body;

        if (!name && !email && !lastname && !username && !avatar) {
            return res.status(400).json({ error: "Erreur: aucun des champs n'a été saisi" });
        }

        try {
            await UserModel.update(
                { name, email, lastname, username, avatar },
                { where: { id } }
            );

            const updatedUser = await UserModel.findByPk(id);
            if (!updatedUser) {
                return res.status(404).json({ error: "Utilisateur non trouvé" });
            }

            res.status(200).json(updatedUser);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    };

    getProfile = async (req, res) => {
        try {
            const user = req.userDetails;
            if (!user) {
                return res.status(404).json({ error: "Utilisateur non trouvé" });
            }
            res.status(200).json(user);
        } catch (error) {
            console.error("Erreur lors de la récupération du profil:", error);
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    };
}

module.exports = UserController;
