const { DataTypes } = require('sequelize');
const database = require('../config/database');
const sequelize = new database().getSequelize();

const Space = sequelize.define('Space', {
    space_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false, // Obligatoire
    },
    book_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    book_saved: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    date_added: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: true,
    paranoid: true
});

// Export du modèle
module.exports = Space;
