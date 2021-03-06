module.exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login')
  }
}

module.exports.isNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/profile')
  } else {
    next()
  }
}

module.exports.checkRole = (role) => (req, res, next) => {
  if (req.isAuthenticated && req.user.role === role) {
    next()
  } else {
    console.log('Acceso no permitido')
    res.redirect('/')
  }
}