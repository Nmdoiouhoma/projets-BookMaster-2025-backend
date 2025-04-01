const express = require('express');
const path = require('path');
const cors = require('cors');
const Database = require("./config/database");
const userRouter = require("./router/UserRouter");
const userModel = require('./models/UserModel');
const bookModel = require('./models/BookModel');
const {Sequelize} = require("sequelize");
const spaceModel = require('./models/SpaceModel');

const app = express();
const port = process.env.PORT || 3000;

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(cors());

// Monte les routes après le middleware statique
app.use('/', userRouter);

spaceModel.belongsTo(userModel, { foreignKey: 'user_id', onDelete: 'CASCADE' });
spaceModel.belongsTo(bookModel, { foreignKey: 'book_id', onDelete: 'CASCADE' });

userModel.hasOne(spaceModel, { foreignKey: 'user_id', onDelete: 'CASCADE' });
bookModel.hasMany(spaceModel, { foreignKey: 'book_id', onDelete: 'CASCADE'});

// Démarrer la connexion à la base de données et le serveur
const dbStart = async () => {
    try {
        await new Database().connect();
        await userModel.sync({ alter: true });
        await bookModel.sync({ alter: true });
        await spaceModel.sync({ alter: true });

        app.listen(port, () => {
            console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
        });
    } catch (error) {
        console.error("❌ Erreur lors du démarrage de l'application :", error);
        process.exit(1);
    }
};

dbStart();
