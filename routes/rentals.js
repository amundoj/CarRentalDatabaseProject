var express = require('express');
var router = express.Router();
const Rental = require('../models/rental.js');
const Vehicle = require('../models/vehicle');
const { ensureAuthenticated, ensureCustomer } = require('../middleware/auth');

// POST route to rent a vehicle
router.post('/rent', ensureAuthenticated, ensureCustomer, async function (req, res, next) {
  try {
    const vehicleId = req.body.vehicleId;

    // Find the vehicle by its ID
    const vehicle = await Vehicle.findByPk(vehicleId);

    // Check if the vehicle exists and is available for rent
    if (!vehicle || vehicle.rented) {
      return res.status(400).json({ error: 'Vehicle not available for rent' });
    }

    // Create a new rental record
    await Rental.create({ userId: req.user.id, vehicleId: vehicleId });

    // Mark the vehicle as rented
    await vehicle.update({ rented: true });

    // Respond with success message
    res.status(200).json({ message: 'Vehicle rented successfully' });
  } catch (err) {
    // Handle any errors by passing them to the next middleware
    next(err);
  }
});

module.exports = router;
