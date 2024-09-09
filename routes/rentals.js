var express = require('express');
var router = express.Router();
const Rental = require('../models/rental.js');
const Vehicle = require('../models/vehicle');
const { ensureAuthenticated, ensureCustomer } = require('../middleware/auth');

router.post('/rent', ensureAuthenticated, ensureCustomer, async function (req, res, next) {
  try {
    const vehicleId = req.body.vehicleId;
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle || vehicle.rented) {
      return res.status(400).json({ error: 'Vehicle not available for rent' });
    }
    await Rental.create({ userId: req.user.id, vehicleId: vehicleId });
    await vehicle.update({ rented: true });
    res.status(200).json({ message: 'Vehicle rented successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
