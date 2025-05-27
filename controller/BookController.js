const { Op } = require('sequelize');
const bookModel = require('../models/BookModel')
const spaceModel = require('../models/SpaceModel')

const addBook = async (req, res) => {

    try {
        const {title, author, description, genre, isbn, publishedDate, page_count,status,date_added,cover} = req.body;

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
            return res.status(400).json({ error: 'Le livre n\'a pas pu être créé, book_id est manquant.' });
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

        return res.status(201).json({message: "Le livre a été ajouter avec succés", book: newBook,space_id: createdSpace.space_id})
    }
    catch(err) {
        console.error("Erreur lors de l'ajout du livre",err)
        res.status(500).json({error: "Erreur interne du serveur"})
    }

    const getAvis = async (req, res)=> {
        /*@todo reccuperer les avis d'un utilisateur '*/
    }
}

module.exports = {addBook}