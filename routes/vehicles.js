const express = require('express');
const router = express.Router();
const { Vehicle, Rental } = require('../models');
const { ensureAuthenticated } = require('../middleware/auth');
const { Op, fn, col } = require('sequelize');

// Utility to calculate 6 months ago
const sixMonthsAgo = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 6);
  return date;
};

// All vehicles
router.get('/', ensureAuthenticated, async (req, res) => {
  const vehicles = await Vehicle.findAll({ include: ['type', 'colour', { model: Rental }] });
  res.render('vehicles', { vehicles, user: req.user, title: 'All Vehicles', filterType: 'all' });
});

// Popular vehicle types (top 5 by count)
router.get('/popular', ensureAuthenticated, async (req, res) => {
  const vehicles = await Vehicle.findAll({
    include: ['type', 'colour', { model: Rental }],
    order: [['make', 'ASC']] // For now just alphabetical; can do count grouping later
  });
  res.render('vehicles', { vehicles, user: req.user, title: 'Popular Vehicle Types', filterType: 'popular' });
});

// Currently rented by logged-in user
router.get('/rented', ensureAuthenticated, async (req, res) => {
  const rentals = await Rental.findAll({
    where: { userId: req.user.id, status: 'active' },
    include: [{ model: Vehicle, include: ['type', 'colour'] }]
  });
  res.render('rented', { rentals, user: req.user });
});

// Vehicles requiring service (>6 months since last service)
router.get('/service', ensureAuthenticated, async (req, res) => {
  const vehicles = await Vehicle.findAll({
    where: { lastServiceDate: { [Op.lt]: sixMonthsAgo() } },
    include: ['type', 'colour', { model: Rental }]
  });
  res.render('vehicles', { vehicles, user: req.user, title: 'Vehicles for Service', filterType: 'service' });
});

// Vehicles with Cruise Control
router.get('/cruise-control', ensureAuthenticated, async (req, res) => {
  const vehicles = await Vehicle.findAll({
    where: { features: { [Op.like]: '%Cruise Control%' } },
    include: ['type', 'colour', { model: Rental }]
  });
  res.render('vehicles', { vehicles, user: req.user, title: 'Cruise Control Vehicles', filterType: 'cruise' });
});

module.exports = router;
