require('dotenv').config();

const cors = require('cors');
const express = require('express');
const Database = require("./config/database");
const userRouter = require("./router/UserRouter");
const userModel = require('./models/UserModel');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use('/', userRouter);


// Démarrer la connexion à la base de données et le serveur
const dbStart = async () => {
    try {
        await new Database().connect();
        await userModel.sync({ alter: true })

        app.listen(port, () => {
            console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
        });

    } catch (error) {
        console.error("❌ Erreur lors du démarrage de l'application :", error);
        process.exit(1); // Arrêter l'application en cas d'erreur critique
    }
};

dbStart();
