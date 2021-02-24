const mongoose = require("mongoose")
const passport = require('passport')
const { sendActivationEmail } = require("../config/mailer.config")
const User = require("../models/User.model")


// login
module.exports.login = (req,res,next) => {
    res.render('authentication/login_form')
}

// doLogin
module.exports.doLogin = (req, res, next) => {
  passport.authenticate('local-auth', (error, user, validations) => {
    if (error) {
      next(error);
    } 
    else if (!user) {
      res.status(400).render('authentication/login_form', { 
        user: req.body, 
        error: validations.error 
      });
    } 
    else {
      req.login(user, loginErr => {
        if(loginErr) {
          next(loginErr)
        }
        else {
          console.log('log in done')
          res.redirect('/profile')
        }
      })
    }
  })(req, res, next)
};

//logut
module.exports.logout = (req, res, next) => {
  req.logout();
  res.redirect("/");
};

// signup
module.exports.signup = (req,res,next) => {
    res.render('authentication/signup_form')
}

module.exports.doSignup = (req,res,next) => {
    function renderWithErrors(errors) {
      res.status(400).render('authentication/signup_form', {
        errors: errors,
        user: req.body
      })
    }
  
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          renderWithErrors({
            email: 'The email or username is already in use'
          })
        } 
        else {
          
          User.create(req.body)
            .then((user) => {
              sendActivationEmail(user.email,user.activationToken)
              res.redirect('/')
            })
            .catch(e => {
              if (e instanceof mongoose.Error.ValidationError) {
                renderWithErrors(e.errors)
              } else {
                next(e)
              }
            })
        }
      })
      .catch(e =>  console.log(e))
  }


module.exports.activate = (req, res, next) => {
  User.findOneAndUpdate(
    { activationToken: req.params.token, active: false },
    { active: true, activationToken: "active" }
  )
    .then((u) => {
      if (u) {
        //TODO: Show message with modal
        console.log('Your account has been activated')
        res.render("authentication/login_form");
      } else {
        //TODO: Show message with modal
        console.log('Problems activating the account')
        res.redirect("/")
      }
    })
    .catch((e) => next(e));
};

//User profile

module.exports.profile = (req,res,next) => {
  res.render("users/profile")
}

module.exports.userInformation = (req, res, next) => {
  res.render("users/user_information")
}

module.exports.userBookings = (req, res, next) => {
  res.render("users/user_bookings")
}

module.exports.userFavourites = (req, res, next) => {
  res.render("users/user_favourites")
}

module.exports.userReviews = (req, res, next) => {
  res.render("users/user_reviews")
}


