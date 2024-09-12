const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define the VehicleColour model
const VehicleColour = sequelize.define('VehicleColour', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true // Auto-incrementing primary key
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false // Colour name must be provided
  }
}, {
  // Enable timestamps to automatically manage 'createdAt' and 'updatedAt'
  timestamps: true
});

// Export the VehicleColour model
module.exports = VehicleColour;
