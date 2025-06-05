const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const Database = require("./config/database");
const userRouter = require("./router/UserRouter");
const userModel = require('./models/UserModel');
const bookModel = require('./models/BookModel');
const spaceModel = require('./models/SpaceModel');
const avisModel = require('./models/AvisModel');

const port = process.env.PORT || 3001;

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.use(express.json());

app.use(cors({
    origin: "http://localhost:63342",
    methods: "GET,POST,PUT,DELETE,PATCH,OPTION",
    allowedHeaders: "Content-Type,Authorization"
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Monte les routes après le middleware statique
app.use('/', userRouter);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

spaceModel.belongsTo(userModel, { foreignKey: 'user_id', onDelete: 'CASCADE' });
spaceModel.belongsTo(bookModel, { foreignKey: 'book_id', onDelete: 'CASCADE' });

userModel.hasOne(spaceModel, { foreignKey: 'user_id', onDelete: 'CASCADE' });
bookModel.hasMany(spaceModel, { foreignKey: 'book_id', onDelete: 'CASCADE' });

userModel.hasMany(avisModel, { foreignKey: 'user_id', onDelete: 'CASCADE' });
avisModel.belongsTo(userModel, { foreignKey: 'user_id', onDelete: 'CASCADE' });

const dbStart = async () => {
    try {
        await new Database().connect();
        await userModel.sync({ alter: true });
        await bookModel.sync({ alter: true });
        await spaceModel.sync({ alter: true });
        await avisModel.sync({ alter: true });
    } catch (error) {
        console.error("Erreur lors du démarrage de l'application :", error);
        process.exit(1);
    }
};

if (require.main === module) {
    dbStart().then(() => {
        app.listen(port, () => {
            console.log(`Listening on the port ${port}`);
        });
    }).catch((error) => {
        console.error("Erreur lors du démarrage du serveur :", error);
    });
}

module.exports = {
    app,
    dbStart,
    userModel,
};
