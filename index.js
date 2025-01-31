// Charger dotenv pour les variables d'environnement
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const Database = require("./config/database");
const UserModel = require("./models/UserModel");
app.use(express.json());
app.use(cors());

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.send('Page d\'accueil - BookMaster');
});

app.get('/users', async (req, res) => {
    try {
        const users = await UserModel.findAll(); // ✅ Correction de findAll()
        res.status(200).json(users); // ✅ Utilisation correcte de la variable
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des utilisateurs :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});


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


const dbStart = async () =>{
    await new Database().connect();
    app.use(bodyParser.json());
    app.use('*',(req,res)=>{
        res.status(404).send('Not found');
        app.listen(port, () => {
            console.log(`Serveur démarré sur le port ${port}`);
        });

    });
}

dbStart()
