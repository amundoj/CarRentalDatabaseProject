const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const VehicleType = require('./vehicleType');
const VehicleColour = require('./vehicleColour');

// Define the Vehicle model
const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  registrationNo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  make: {
    type: DataTypes.STRING,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  colourId: {
    type: DataTypes.INTEGER,
    references: {
      model: VehicleColour,
      key: 'id'
    }
  },
  vehicleTypeId: {
    type: DataTypes.INTEGER,
    references: {
      model: VehicleType,
      key: 'id'
    }
  },
  features: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastServiceDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  rented: {
    type: DataTypes.BOOLEAN,
    defaultValue: false // Indicates whether the vehicle is currently rented
  }
}, {
  // Enable timestamps for automatic 'createdAt' and 'updatedAt' fields
  timestamps: true
});

// Export the Vehicle model
module.exports = Vehicle;
