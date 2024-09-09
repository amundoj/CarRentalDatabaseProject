var express = require('express');
var router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');
const VehicleType = require('../models/vehicleType');
const Vehicle = require('../models/vehicle');

// Get all vehicle types
router.get('/', ensureAuthenticated, ensureAdmin, async function (req, res, next) {
  try {
    const types = await VehicleType.findAll();
    res.render('types', { user: req.user, types: types, error: '' });
  } catch (err) {
    next(err);
  }
});

// Add a new vehicle type
router.post('/add', ensureAuthenticated, ensureAdmin, async function (req, res, next) {
  try {
    const { name } = req.body;
    await VehicleType.create({ name, createdAt: new Date(), updatedAt: new Date() });
    res.redirect('/types');
  } catch (err) {
    console.error('Error creating vehicle type:', err);
    next(err);
  }
});

// Update an existing vehicle type
router.post('/update/:id', ensureAuthenticated, ensureAdmin, async function (req, res, next) {
  try {
    const { name } = req.body;
    const type = await VehicleType.findByPk(req.params.id);
    if (type) {
      await type.update({ name, updatedAt: new Date() });
      res.redirect('/types');
    } else {
      res.status(404).send('Vehicle type not found');
    }
  } catch (err) {
    console.error('Error updating vehicle type:', err);
    next(err);
  }
});

// Delete a vehicle type
router.post('/delete/:id', ensureAuthenticated, ensureAdmin, async function (req, res, next) {
  try {
    const type = await VehicleType.findByPk(req.params.id);
    if (type) {
      await type.destroy();
      res.redirect('/types');
    } else {
      res.status(404).send('Vehicle type not found');
    }
  } catch (err) {
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      console.error('Cannot delete or update vehicle type:', err);
      const types = await VehicleType.findAll();
      res.render('types', { user: req.user, types: types, error: 'Cannot delete or update vehicle type because it is referenced by a vehicle.' });
    } else {
      next(err);
    }
  }
});

module.exports = router;
