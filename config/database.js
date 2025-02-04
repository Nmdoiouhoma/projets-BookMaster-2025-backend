const {Sequelize} = require("sequelize");
require('dotenv').config();

class Database {
    constructor() {
        this.sequelize = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER,
            process.env.DB_PASS,
            {
                host: process.env.DB_HOST,
                dialect: 'postgres',
                logging: false,
            }
        );
    }
    getSequelize() {
        return this.sequelize;
    }
    async connect() {
        try {
            await this.sequelize.authenticate();
            console.log("✅ Connexion à la base de données réussie");
        } catch (error) {
            console.error("❌ Erreur de connexion à la base de données :", error);
        }
    }
}

module.exports = Database;