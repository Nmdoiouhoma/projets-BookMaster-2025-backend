const UserModel = require('../models/UserModel');
const bookModel = require('../models/BookModel');
const spaceModel = require('../models/SpaceModel');

class UserController {
    constructor() {}

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

    updateUser = async (req, res, next) => {
        const { id } = req.params;
        const { name, email, lastname, username } = req.body;

        let fieldsToUpdate = { name, email, lastname, username };

        if (req.file) {
            const avatarPath = `/uploads/avatars/${req.file.filename}`;
            console.log("Avatar téléchargé :", avatarPath);
            fieldsToUpdate.avatar = avatarPath;
        } else {
            console.log("Aucun avatar envoyé, l'ancien est conservé.");
        }

        try {
            // Mise à jour des champs dynamiques
            await UserModel.update(fieldsToUpdate, { where: { id } });

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

    getListBook = async (req, res) => {
        try{
            const user_id = req.params.user_id;
            if (!user_id) {
                return res.status(400).json({error: "L'ID utilisateur est requis !"})
            }
            const bookList = await spaceModel.findAll({
                where: {user_id: req.params.user_id},
                attributes: ['status','book_id'],
                include: [{
                    model: bookModel,
                    attributes: ['title','author','page_count','cover'],
                }],
            })
            if (!bookList || bookList.length === 0) {
                return res.status(404).json({ error: "Aucun livre trouvé dans votre espace." });
            }else {
                return res.status(200).json({message: "Votre liste de livre à été trouvé avec succés", books: bookList});
            }
        }catch (error) {
            console.error("Erreur lors de la récupération de la liste de livres :", error);
            return res.status(500).json({ error: "Erreur serveur. Vérifiez les logs." });
        }
    }

    getOneBook = async (req, res) => {
        const book_id = req.params.book_id
        try{
            if(!book_id){
                return res.status(400).json({error: "L'id du livre est requis !"})
            }
            const book = await spaceModel.findOne({
                where: {book_id: req.params.book_id},
                attributes:['space_id','current_page'],
                include: [{
                    model: bookModel,
                    attributes: ['title','author','page_count','cover'],
                }],
            })
            if(!book){
                return res.status(400).json({error: "Le livre est introuvable !"})
            }else{
                return res.status(200).json({message: "Votre livre à bien été trouvé", books: book});
            }
        }catch (error) {
            console.error("Erreur lors de la récupération de votre livre :", error);
            return res.status(500).json({ error: "Erreur serveur. Vérifiez les logs." });
        }
    }

    deleteBook = async (req, res) => {
        const { space_id } = req.params;
        const { book_id } = req.params;

        try{
            if(!space_id){
                return res.status(400).json({error: "L'id de l'espace personnel est introuvable"})
            }
            const bookSpaceDeleted = await spaceModel.destroy({
                where: { space_id },
                force: true,
            })

            const bookDeleted = await bookModel.destroy({
                where: { book_id },
                force:true,
            })
            if (!bookSpaceDeleted && !bookDeleted) {
                return res.status(200).json({message: `Le livre avec l'id espace : ${space_id} id book ${book_id} a bien été supprimé`})
            }else{
                return res.status(400).json({error: `Erreur le livre n'a pas été trouvé id space : ${space_id}`})
            }

        }catch (error) {
            console.error("Erreur lors de la suppression du livre",error)
            return res.status(500).json({ error: "Erreur serveur. Vérifiez les logs." });
        }
    }

    updateBook = async (req, res) => {
        const { user_id, book_id } = req.params;
        const { status, current_page } = req.body;

        if (!status && !current_page) {
            return res.status(400).json({ error: "Aucun des champs n'a été saisi" });
        }

        try {
            // 🔹 Met à jour et récupère le nombre de lignes modifiées
            const [updatedRows] = await spaceModel.update(
                { status, current_page },
                { where: { user_id, book_id } }
            );

            if (updatedRows === 0) {
                return res.status(404).json({ error: `Aucune mise à jour effectuée. Vérifiez les IDs (${user_id}, ${book_id})` });
            }

            const updatedBook = await spaceModel.findOne({ where: { user_id, book_id } });

            console.log("Nouveau status :", updatedBook.status, "Page actuelle :", updatedBook.current_page);

            return res.status(200).json({
                message: `Le livre avec l'ID ${book_id} a été mis à jour avec succès`,
                book: updatedBook
            });

        } catch (error) {
            console.error("rreur lors de la mise à jour du livre :", error);
            return res.status(500).json({ error: "Erreur serveur. Vérifiez les logs." });
        }
    };

}

module.exports = UserController;
