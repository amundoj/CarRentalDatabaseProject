const fs = require('fs');
const path = require('path');
const sequelize = require('./config/database');
const VehicleColour = require('./models/vehicleColour');
const VehicleType = require('./models/vehicleType');
const Vehicle = require('./models/vehicle');
const User = require('./models/user');

async function populateDatabase() {
  try {
    await sequelize.sync({ force: true });

    // Populate VehicleColours
    const coloursData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'vehicleColours.json'), 'utf8'));
    await VehicleColour.bulkCreate(coloursData);

    // Populate VehicleTypes
    const typesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'vehicleTypes.json'), 'utf8'));
    await VehicleType.bulkCreate(typesData);

    // Populate Vehicles
    const vehiclesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'vehicles.json'), 'utf8'));
    await Vehicle.bulkCreate(vehiclesData);

    // Populate Users with check for duplicates
    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'users.json'), 'utf8'));
    for (const userData of usersData) {
      const [user, created] = await User.findOrCreate({
        where: { username: userData.username },
        defaults: userData
      });
      if (!created) {
        console.log(`User ${user.username} already exists.`);
      } else {
        console.log(`User ${user.username} created.`);
      }
    }

    console.log('Database populated from JSON files');
  } catch (err) {
    console.error('Error populating database:', err);
  }
}

module.exports = { populateDatabase };