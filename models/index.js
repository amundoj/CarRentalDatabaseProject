const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'mysql',
  host: 'localhost'
});

const Vehicle = require('./vehicle');
const VehicleColour = require('./vehicleColour');
const VehicleType = require('./vehicleType');
const Rental = require('./rental');
const User = require('./user');

Vehicle.belongsTo(VehicleColour, { as: 'colour', foreignKey: 'colourId' });
Vehicle.belongsTo(VehicleType, { as: 'type', foreignKey: 'vehicleTypeId' });
Rental.belongsTo(Vehicle, { foreignKey: 'vehicleId' });
Rental.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Rental, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  Vehicle,
  VehicleColour,
  VehicleType,
  Rental,
  User
};
