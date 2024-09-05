const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VehicleColour = sequelize.define('VehicleColour', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false }
}, {
  timestamps: true
});

module.exports = VehicleColour;
