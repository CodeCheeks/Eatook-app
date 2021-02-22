const mongoose = require("mongoose")

const User = require("../models/User.model")

const { sendActivationEmail } = require("../config/mailer.config")

// login
module.exports.login = (req,res,next) => {
    res.render('authentication/login_form')
}

// signup

module.exports.signup = (req,res,next) => {
    res.render('authentication/signup_form')
}

module.exports.doSignup = (req,res,next) => {
    console.log('The form data: ', req.body)      //La información del formulario se manda con el post y se almacena en req.body
    function renderWithErrors(errors) {
      res.status(400).render('authentication/signup_form', {
        errors: errors,
      })
    }
  
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          renderWithErrors({
            email: 'Ya existe un usuario con este email'
          })
        } 
        else {
          User.create(req.body)
            .then((user) => {
              //sendActivationEmail(user.email,user.activationToken)
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
      .catch(e => next(e))
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