// Middleware to ensure the user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
}

// Middleware to ensure the user is an admin
function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ error: 'Access denied. Admins only.' });
}

// Middleware to ensure the user is a customer
function ensureCustomer(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'customer') {
    return next();
  }
  res.status(403).json({ error: 'Access denied. Customers only.' });
}

// Middleware to ensure the user is either an admin or a customer
function ensureAdminOrCustomer(req, res, next) {
  if (req.isAuthenticated() && (req.user.role === 'admin' || req.user.role === 'customer')) {
    return next();
  }
  res.status(403).json({ error: 'Access denied. Admins or Customers only.' });
}

module.exports = { 
  ensureAuthenticated, 
  ensureAdmin, 
  ensureCustomer, 
  ensureAdminOrCustomer 
};