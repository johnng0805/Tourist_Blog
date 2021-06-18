const { Sequelize, DataTypes } = require('sequelize');
const db = require('./db');

const Post = db.define('Blog', {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        references: 'users',
        referencesKey: 'id',
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'blogs'
})

module.exports = Post;