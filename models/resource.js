const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Resource = sequelize.define('resources', { 
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', 
          key: 'id'
        },
        onDelete: 'CASCADE'
    },
    fileName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    filePath: {
      type: Sequelize.STRING,
      allowNull: false
    },
    uploadedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
})

module.exports = Resource;