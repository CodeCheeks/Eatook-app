const passport = require('passport');
const mongoose = require('mongoose')
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
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
    console.log('use passport-local-strategy')
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


  passport.use('google-auth', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI 
  }, (accessToken, refreshToken, profile, next) => {
    const googleID = profile.id
    const email = profile.emails[0] ? profile.emails[0].value : undefined;
    const firstname = profile.name.givenName 
    const lastname = profile.name.familyName
    const image = profile.photos[0].value || `http://ssl.gstatic.com/accounts/ui/avatar_2x.png`
  
    if (googleID && email) {
      console.log('use passport-google-strategy')
      User.findOne({ $or: [
        { email: email },
        { 'social.google': googleID }
      ]})
      .then(user => {
        if (!user) {
          const newUserInstance = new User({
            firstname,
            lastname,
            email,
            image,
            password: 'Aa1' + mongoose.Types.ObjectId(),
            social: {
              google: googleID
            },
            active: true
          })
  
          return newUserInstance.save()
            .then(newUser => next(null, newUser))
        } else {
          next(null, user)
        }
      })
      .catch(next)
    } else {
      next(null, null, { error: 'Error de conexión con Google OAuth' })
    }
  }))

