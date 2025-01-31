const {Sequelize} = require("sequelize");

class Database{
    constructor(){
        this.sequelize = new Sequelize(process.env.DB_PASS, process.env.DB_USER, process.env.DB_PORT,{
            host: process.env.DB_HOST,
            dialect: 'postgres',
            logging: false,
        })
    }
    getSequelize =  () => {
        return this.sequelize
    }
    connect = async () => {
        try{
            const User = require("../models/UserModel");
            await this.sequelize.authenticate()
            await User.sync({alter: true})
            console.log("Connexion à la base de donnée reussie");
        }catch (error) {
            console.log("Impossible de se connecter à la base donnnée", error)
        }
    }
}

module.exports = Database;