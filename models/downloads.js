const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Download = sequelize.define('downloads', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
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
    resourceId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'resources',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    downloadedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  });
  

module.exports = Download;