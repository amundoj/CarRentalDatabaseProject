var express = require('express');
var router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');
const VehicleColour = require('../models/vehicleColour');
const Vehicle = require('../models/vehicle');

// Get all vehicle colours
router.get('/', ensureAuthenticated, ensureAdmin, async function (req, res, next) {
  try {
    const colours = await VehicleColour.findAll();
    res.render('colours', { user: req.user, colours: colours });
  } catch (err) {
    next(err);
  }
});

// Add a new vehicle colour
router.post('/add', ensureAuthenticated, ensureAdmin, async function (req, res, next) {
  try {
    const { name } = req.body;
    await VehicleColour.create({ name, createdAt: new Date(), updatedAt: new Date() });
    res.redirect('/colours');
  } catch (err) {
    console.error('Error creating vehicle colour:', err);
    next(err);
  }
});

// Update an existing vehicle colour
router.post('/update/:id', ensureAuthenticated, ensureAdmin, async function (req, res, next) {
  try {
    const { name } = req.body;
    const colour = await VehicleColour.findByPk(req.params.id);
    if (colour) {
      await colour.update({ name, updatedAt: new Date() });
      res.redirect('/colours');
    } else {
      res.status(404).send('Vehicle colour not found');
    }
  } catch (err) {
    console.error('Error updating vehicle colour:', err);
    next(err);
  }
});

// Delete a vehicle colour
router.post('/delete/:id', ensureAuthenticated, ensureAdmin, async function (req, res, next) {
  try {
    const colour = await VehicleColour.findByPk(req.params.id);
    if (colour) {
      await colour.destroy();
      res.redirect('/colours');
    } else {
      res.status(404).send('Vehicle colour not found');
    }
  } catch (err) {
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      console.error('Cannot delete or update vehicle colour:', err);
      const colours = await VehicleColour.findAll();
      res.render('colours', { user: req.user, colours: colours, error: 'Cannot delete or update vehicle colour because it is referenced by a vehicle.' });
    } else {
      next(err);
    }
  }
});

router.get('/', ensureAuthenticated, ensureAdmin, async function (req, res, next) {
  try {
    const colours = await VehicleColour.findAll();
    res.render('colours', { user: req.user, colours: colours, error: '' });
  } catch (err) {
    next(err);
  }
});


module.exports = router;
