const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const database = require('../config/database');
const sequelize = new database().getSequelize();

const Book = sequelize.define('Book', {
    book_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    publication_date: {
        type: DataTypes.DATE,
    },
    genre: {
        type: DataTypes.STRING,
    },
    isbn: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    page_count: {
        type: DataTypes.INTEGER,
    },
}, {
    timestamps: true,
    paranoid: true
});

module.exports = Book;
