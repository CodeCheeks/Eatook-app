const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User.model')

//CONFIG ALL LOGIN
passport.serializeUser((user, next) => {
    next(null, user.id);
  });
  
  passport.deserializeUser((id, next) => {
    User.findById(id)
      .then(user => next(null, user))
      .catch((err) => next(err));
  });

  //CONFIG LOCAL LOGIN
  passport.use('local-auth', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (email, password, next) => {
    console.log('use passport')
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          next(null, false, { error: "Email or password is incorrect" })
        } else {
          return user.checkPassword(password)
            .then(match => {
              if (match) {
                if (user.active) {
                  next(null, user)
                } else {
                  next(null, false, { error: "Activate your account" })
                }
              } else {
                next(null, false, { error: "Email or password is incorrect" })
              }
            })
        }
      })
      .catch(next)
  }))