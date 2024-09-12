const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define the VehicleType model
const VehicleType = sequelize.define('VehicleType', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true // Auto-incrementing primary key
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false // Vehicle type name must be provided
  }
}, {
  // Enable timestamps to automatically manage 'createdAt' and 'updatedAt'
  timestamps: true
});

// Export the VehicleType model
module.exports = VehicleType;
