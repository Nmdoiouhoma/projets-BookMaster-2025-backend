const { DataTypes, UUIDV4, UUID, Sequelize} = require('sequelize');
const database = require('../config/database');
const sequelize = new database().getSequelize()
class UserModel {

    constructor() {
        const user = sequelize.define('user', {
            id: {
                type: DataTypes.UUID,
                defaultValue: UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            avatar: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            deleteAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            timestamps: true,
            paranoid: true
        })

    }
}

module.exports = UserModel;