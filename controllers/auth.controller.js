const mongoose = require("mongoose")
const { use } = require("passport")
const passport = require('passport')
const { sendActivationEmail } = require("../config/mailer.config")
const User = require("../models/User.model")

// login
module.exports.login = (req,res,next) => {
    console.log('USER', req.user)
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
        //user: req.body,  TODO
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

  
//forgot pass
module.exports.forgotpass = (req,res,next) => {
  res.render("authentication/forgot_pass");
}

module.exports.doForgotpass = (req,res,next) => {
  function renderWithErrors(errors) {
    res.status(400).render('authentication/forgot_pass', {
      errors: errors
    })
  }

  User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          sendActivationEmail(user.email)
          res.render("authentication/check_email")
        } 
        else {
          renderWithErrors({
            email: 'The email is incorrect'
          })
        }
      })
      .catch(e =>  console.log(e))
}


//logout
module.exports.logout = (req, res, next) => {
  req.logout();
  res.redirect("/");
};


//verify account
module.exports.verify = (req,res,next) => {
  res.render("authentication/verify_account");
}

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
              res.redirect("/signup/verify-account");
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
        res.render("authentication/login_form");
      } else {
        res.redirect("/")
      }
    })
    .catch((e) => next(e));
};