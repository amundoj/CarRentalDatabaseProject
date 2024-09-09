var express = require('express');
var router = express.Router();
const { Op } = require('sequelize');
const { Vehicle, VehicleType, VehicleColour, Rental, User } = require('../models');
const { ensureAuthenticated, ensureAdminOrCustomer, ensureCustomer, ensureAdmin } = require('../middleware/auth');

function isServiceable(lastServiceDate) {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return lastServiceDate < sixMonthsAgo;
}

// Fetch all vehicles
router.get('/', ensureAuthenticated, ensureAdminOrCustomer, async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      include: [
        { model: VehicleType, as: 'type' },
        { model: VehicleColour, as: 'colour' }
      ]
    });

    // Add serviceable status
    const vehiclesWithServiceStatus = vehicles.map(vehicle => ({
      ...vehicle.toJSON(),
      serviceable: isServiceable(vehicle.lastServiceDate)
    }));

    res.render('vehicles', { vehicles: vehiclesWithServiceStatus, user: req.user });
  } catch (err) {
    console.error('Error fetching vehicles:', err);
    res.status(500).send('Internal Server Error');
  }
});
// Rent a vehicle
router.post('/rent', ensureAuthenticated, ensureCustomer, async function (req, res, next) {
  try {
    const vehicleId = req.body.vehicleId;
    const userId = req.user.id;

    // Check if the user already has a rented vehicle
    const existingRental = await Rental.findOne({ where: { userId: userId } });
    if (existingRental) {
      return res.status(400).json({ error: 'You already have a rented vehicle' });
    }

    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle || vehicle.rented || isServiceable(vehicle.lastServiceDate)) {
      return res.status(400).json({ error: 'Vehicle not available for rent' });
    }

    await Rental.create({ userId: userId, vehicleId: vehicleId, rentalDate: new Date() });
    await vehicle.update({ rented: true });

    res.status(200).json({ message: 'Vehicle rented successfully' });
  } catch (err) {
    console.error('Error renting vehicle:', err);
    next(err);
  }
});

// Cancel a rental
router.post('/cancel-rental', ensureAuthenticated, ensureAdmin, async function (req, res, next) {
  try {
    const vehicleId = req.body.vehicleId;
    const rental = await Rental.findOne({ where: { vehicleId: vehicleId } });
    if (!rental) {
      return res.status(400).json({ error: 'Rental not found' });
    }

    await rental.destroy();
    await Vehicle.update({ rented: false }, { where: { id: vehicleId } });

    res.status(200).json({ message: 'Rental canceled successfully' });
  } catch (err) {
    console.error('Error canceling rental:', err);
    next(err);
  }
});

// Fetch rented vehicles
router.get('/rented', ensureAuthenticated, ensureAdminOrCustomer, async function (req, res, next) {
  try {
    let rentals;
    if (req.user.role === 'admin') {
      // Admin can view all rented vehicles
      rentals = await Rental.findAll({
        include: [
          { model: Vehicle, include: [{ model: VehicleType, as: 'type' }, { model: VehicleColour, as: 'colour' }] },
          { model: User }
        ]
      });
    } else {
      // Customer can only view their own rented vehicles
      rentals = await Rental.findAll({
        where: { userId: req.user.id },
        include: [
          { model: Vehicle, include: [{ model: VehicleType, as: 'type' }, { model: VehicleColour, as: 'colour' }] }
        ]
      });
    }

    const vehicles = rentals.map(rental => ({
      ...rental.Vehicle.toJSON(),
      serviceable: isServiceable(rental.Vehicle.lastServiceDate)
    }));

    if (req.headers['accept'].includes('application/json')) {
      res.json({ vehicles });
    } else {
      res.render('vehicles', { user: req.user, vehicles });
    }
  } catch (err) {
    console.error('Error fetching rented vehicles:', err);
    next(err);
  }
});

// Fetch vehicles requiring service
router.get('/service', ensureAuthenticated, ensureAdmin, async function (req, res, next) {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const vehicles = await Vehicle.findAll({
      where: {
        lastServiceDate: { [Op.lt]: sixMonthsAgo },
        rented: false
      },
      include: [
        { model: VehicleType, as: 'type' },
        { model: VehicleColour, as: 'colour' }
      ]
    });

    const serviceableVehicles = vehicles.map(vehicle => ({
      ...vehicle.toJSON(),
      serviceable: isServiceable(vehicle.lastServiceDate)
    }));

    if (req.headers['accept'].includes('application/json')) {
      res.json({ vehicles: serviceableVehicles });
    } else {
      res.render('vehicles', { user: req.user, vehicles: serviceableVehicles });
    }
  } catch (err) {
    console.error('Error fetching vehicles for service:', err);
    next(err);
  }
});

// Fetch popular vehicle types (SUV)
router.get('/popular', ensureAuthenticated, ensureAdminOrCustomer, async function (req, res, next) {
  try {
    const vehicles = await Vehicle.findAll({
      include: [
        { model: VehicleType, as: 'type' },
        { model: VehicleColour, as: 'colour' }
      ],
      where: { vehicleTypeId: 2 }
    });

    const popularVehicles = vehicles.map(vehicle => ({
      ...vehicle.toJSON(),
      serviceable: isServiceable(vehicle.lastServiceDate)
    }));

    if (req.headers['accept'].includes('application/json')) {
      res.json({ vehicles: popularVehicles });
    } else {
      res.render('vehicles', { user: req.user, vehicles: popularVehicles });
    }
  } catch (err) {
    console.error('Error fetching popular vehicle types:', err);
    next(err);
  }
});

// Fetch vehicles with cruise control
router.get('/cruise-control', ensureAuthenticated, ensureAdminOrCustomer, async function (req, res, next) {
  try {
    const vehicles = await Vehicle.findAll({
      where: { features: { [Op.like]: '%Cruise Control%' } },
      include: [
        { model: VehicleType, as: 'type' },
        { model: VehicleColour, as: 'colour' }
      ]
    });
    const cruiseControlVehicles = vehicles.map(vehicle => ({
      ...vehicle.toJSON(),
      serviceable: isServiceable(vehicle.lastServiceDate)
    }));
    if (req.headers['accept'].includes('application/json')) {
      res.json({ vehicles: cruiseControlVehicles });
    } else {
      res.render('vehicles', { user: req.user, vehicles: cruiseControlVehicles });
    }
  } catch (err) {
    console.error('Error fetching vehicles with cruise control:', err);
    next(err);
  }
});

module.exports = router;