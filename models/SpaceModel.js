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
    book_liked: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    add_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: true,
    paranoid: true
});

// Export du modèle
module.exports = Space;
