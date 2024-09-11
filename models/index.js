const { Sequelize, DataTypes } = require('sequelize');

// Initialize the Sequelize instance with the database credentials
const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'mysql',
  host: 'localhost'
});

// Import models
const Vehicle = require('./vehicle');
const VehicleColour = require('./vehicleColour');
const VehicleType = require('./vehicleType');
const Rental = require('./rental');
const User = require('./user');

// Define relationships between models

// Vehicle belongs to a specific colour and type
Vehicle.belongsTo(VehicleColour, { as: 'colour', foreignKey: 'colourId' });
Vehicle.belongsTo(VehicleType, { as: 'type', foreignKey: 'vehicleTypeId' });

// Rental belongs to a specific vehicle and user
Rental.belongsTo(Vehicle, { foreignKey: 'vehicleId' });
Rental.belongsTo(User, { foreignKey: 'userId' });

// A user can have many rentals
User.hasMany(Rental, { foreignKey: 'userId' });

// Export all models and the sequelize instance for use elsewhere
module.exports = {
  sequelize,
  Vehicle,
  VehicleColour,
  VehicleType,
  Rental,
  User
};
