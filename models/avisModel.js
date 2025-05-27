const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const database = require('../config/database');
const sequelize = new database().getSequelize();

const Avis = sequelize.define('avis', {
    avis_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    book_id:{
        type: DataTypes.UUID,
        allowNull: true,
    },
    book_liked: {
        type: DataTypes.BOOLEAN,
    },
    user_avis:{
        type: DataTypes.TEXT,
    },
    note: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    note_average:{
        type: DataTypes.FLOAT,
    }
})
module.exports = Avis;