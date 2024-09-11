const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Vehicle = require('./vehicle');
const User = require('./user');

// Define the Rental model
const Rental = sequelize.define('Rental', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
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
  rentalDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  // Enable timestamps to automatically manage 'createdAt' and 'updatedAt' fields
  timestamps: true
});

// Define associations
Rental.belongsTo(User, { foreignKey: 'userId' });
Rental.belongsTo(Vehicle, { foreignKey: 'vehicleId' });

// Export the Rental model
module.exports = Rental;
