const isLoggedIn = (req, res, next) => {
  if (req.session && req.session.userID) {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    return next();
  }
  res.redirect('/auth/login');
};

module.exports = isLoggedIn;