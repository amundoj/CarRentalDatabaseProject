const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define the User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // Ensure that the username is unique
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false // Role can be used to distinguish user types like 'admin', 'customer', etc.
  }
}, {
  // Enable timestamps to automatically handle 'createdAt' and 'updatedAt'
  timestamps: true
});

// Export the User model
module.exports = User;
