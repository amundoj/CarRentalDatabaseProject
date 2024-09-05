const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Vehicle = require('./vehicle');
const User = require('./user');

const Rental = sequelize.define('Rental', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  vehicleId: {
    type: DataTypes.INTEGER,
    references: {
      model: Vehicle,
      key: 'id'
    }
  },
  rentalDate: { type: DataTypes.DATE, allowNull: false }
}, {
  timestamps: true
});

Rental.belongsTo(User, { foreignKey: 'userId' });
Rental.belongsTo(Vehicle, { foreignKey: 'vehicleId' });

module.exports = Rental;
