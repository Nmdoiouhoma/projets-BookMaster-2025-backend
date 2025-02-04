const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const database = require('../config/database');
const sequelize = new database().getSequelize()


        const User = sequelize.define('user', {
            id: {
                type: DataTypes.UUID,
                autoIncrement: true,
                primaryKey: true,
                defaultValue: uuidv4,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastname: {
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
                allowNull: true,
            },
            avatar: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            deleteAt: {
                type: DataTypes.DATE,
                allowNull: true,
            }
            },{
        timestamps: true,
        paranoid: true
        })

module.exports = User;