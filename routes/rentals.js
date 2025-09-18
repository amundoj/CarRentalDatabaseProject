var express = require('express');
var router = express.Router();
const Rental = require('../models/rental');
const Vehicle = require('../models/vehicle');
const { ensureAuthenticated, ensureCustomer, ensureAdmin } = require('../middleware/auth');

// GET: List rentals (admin ser alle, customer ser sine)
router.get('/', ensureAuthenticated, async (req, res, next) => {
  try {
    let rentals;
    if (req.user.role === 'admin') {
      rentals = await Rental.findAll({ include: [User, Vehicle] });
    } else {
      rentals = await Rental.findAll({ where: { userId: req.user.id }, include: Vehicle });
    }
    res.render('rentals', { rentals, user: req.user });  // Lag views/rentals.ejs
  } catch (err) {
    next(err);
  }
});

// POST: Create rental (rent vehicle)
router.post('/', ensureAuthenticated, ensureCustomer, async (req, res, next) => {
  try {
    const { vehicleId, endDate } = req.body;  // Legg til endDate fra form
    const existingRental = await Rental.findOne({ where: { userId: req.user.id, status: 'active' } });
    if (existingRental) return res.status(400).json({ error: 'You already have an active rental' });

    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle || vehicle.rented) return res.status(400).json({ error: 'Vehicle not available' });

    const rental = await Rental.create({ userId: req.user.id, vehicleId, endDate, status: 'active' });
    await vehicle.update({ rented: true });

    res.json({ message: 'Rental created successfully' });
  } catch (err) {
    next(err);
  }
});

// PUT: Update rental (e.g., return vehicle)
router.put('/:id', ensureAuthenticated, ensureAdmin, async (req, res, next) => {  // Admin only for return
  try {
    const rental = await Rental.findByPk(req.params.id);
    if (!rental) return res.status(404).json({ error: 'Rental not found' });

    await rental.update({ endDate: new Date(), status: 'completed' });
    await Vehicle.update({ rented: false }, { where: { id: rental.vehicleId } });

    res.json({ message: 'Rental completed' });
  } catch (err) {
    next(err);
  }
});

// DELETE: Cancel rental
router.delete('/:id', ensureAuthenticated, async (req, res, next) => {
  try {
    const rental = await Rental.findByPk(req.params.id);
    if (!rental || (req.user.role !== 'admin' && rental.userId !== req.user.id)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await rental.update({ status: 'cancelled' });  // Soft delete
    await Vehicle.update({ rented: false }, { where: { id: rental.vehicleId } });

    res.json({ message: 'Rental cancelled' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;