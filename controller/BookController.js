const { Op } = require('sequelize');
const bookModel = require('../models/BookModel')
const spaceModel = require('../models/SpaceModel')
const avisModel = require('../models/AvisModel')

const addBook = async (req, res) => {

    try {
        const {
            title,
            author,
            description,
            genre,
            isbn,
            publishedDate,
            page_count,
            status,
            date_added,
            cover
        } = req.body;

        const existingBook = await bookModel.findOne({
            where: {
                [Op.or]: [
                    {title: title},
                    {isbn: isbn},
                ]
            }
        })
        if (existingBook) {
            return res.status(400).json({error: "Ce livre existe deja dans la base de donnee"})
        }
        const newBook = await bookModel.create({
            title,
            author,
            cover,
            description,
            genre,
            isbn,
            publishedDate,
            page_count,
        });

        const bookId = newBook.book_id;
        console.log("Livre créé avec l'id:", bookId);

        if (!bookId) {
            return res.status(400).json({error: 'Le livre n\'a pas pu être créé, book_id est manquant.'});
        }

        const userId = req.user.id;

        const createdSpace = await spaceModel.create({
            book_id: bookId,
            user_id: userId,
            status,
            title: newBook.title,
            author: newBook.author,
            date_added,
        })


        return res.status(201).json({
            message: "Le livre a été ajouté avec succès",
            book: newBook,
            space_id: createdSpace.space_id,
            book_id: bookId
        });

    } catch (err) {
        console.error("Erreur lors de l'ajout du livre", err)
        res.status(500).json({error: "Erreur interne du serveur"})
    }
}

const sendAvis = async (req, res) => {
    try {
        console.log("req.body reçu :", req.body);

        const { note, book_liked, user_avis, isbn, title } = req.body;
        const userId = req.user.id;

        // 1. On récupère le livre
        const existingBook = await bookModel.findOne({
            where: {
                [Op.or]: [
                    { isbn: isbn },
                    { title: title }
                ]
            }
        });

        if (!existingBook) {
            return res.status(400).json({ error: "Ce livre n'est pas enregistré dans votre espace" });
        }

        const bookId = existingBook.book_id; // 🔥 On récupère bien le book_id

        // 2. On cherche un avis existant avec user_id + book_id
        const existingAvis = await avisModel.findOne({
            where: {
                user_id: userId,
                book_id: bookId
            }
        });

        let avis;
        if (existingAvis) {
            // 3. Mise à jour si avis déjà existant

            const fieldsToUpdate = {};
            if (note !== undefined) fieldsToUpdate.note = note;
            if (book_liked !== undefined) fieldsToUpdate.book_liked = book_liked;
            if (user_avis !== undefined) fieldsToUpdate.user_avis = user_avis;

            await existingAvis.update(fieldsToUpdate);
            avis = existingAvis;
        } else {
            // 4. Création d’un nouvel avis avec le bon book_id
            avis = await avisModel.create({
                note,
                book_liked,
                user_avis,
                user_id: userId,
                book_id: bookId,
                title: existingBook.title,
                isbn: existingBook.isbn
            });
        }

        return res.status(200).json({ message: "Avis mis à jour ou créé", avis });

    } catch (error) {
        console.error("Erreur lors de l'ajout/mise à jour de l'avis", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

const getAvis = async (req, res)=> {
    /*@todo reccuperer les avis d'un utilisateur '*/
}

module.exports = {addBook, sendAvis}