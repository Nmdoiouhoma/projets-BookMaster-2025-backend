// Charger dotenv pour les variables d'environnement
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const authMiddlewares = require('./Middlewares/AuthMiddlewares');

app.use(express.json());
app.use(cors());

//
let users = [
    { id: 1, name: "nakib", email: "nakib@example.com", password: "password123" },
    { id: 2, name: "Jane Doe", email: "janedoe@example.com", password: "password456" }
];

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.send('Page d\'accueil - BookMaster');
});

app.get('/users', (req, res) => {

    res.status(200).json(users);
})

app.post('/users', (req, res) => {
    const {name, email, password} = req.body;
    if (!name || !email || !password || !password || !name) {
        return res.status(500).json('Le mot de passe et l\' mail sont obligatoire')
    }
    const user = {name, email, password};
    return res.status(200).json(user)
})

app.patch('/users/:id', (req, res) => {
    const {name, email} = req.body;
    const {id} = req.params;

    if(!name && !email){
        return res.status(400).json('Erreur: aucun des champs n\'a été saisi')
    }
    res.status(200).json(`La mise à jour a été prise en compte ${id}, ${name}, ${email}`)
})
app.delete('/users/:id', (req, res) => {
    const {id} = req.params;
    res.status(200).json(`Element avec id ${id} à été suprimé`)
})

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
