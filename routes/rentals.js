var express = require('express');
var router = express.Router();
const Rental = require('../models/rental');
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
    await vehicle.update({ rented: true, lastRented: new Date() });

    // Respond with success message
    res.status(200).json({ message: 'Vehicle rented successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});


module.exports = router;
