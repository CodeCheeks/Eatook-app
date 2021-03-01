const mongoose = require("mongoose")
const { use } = require("passport")
const passport = require('passport')
const { sendActivationEmail, recoverPassEmail } = require("../config/mailer.config")
const User = require("../models/User.model")
const { v4: uuidv4 } = require('uuid');






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


module.exports.doLoginGoogle = (req, res, next) => {
  passport.authenticate('google-auth', (error, user, validations) => {
    if (error) {
      next(error);
    } else if (!user) {
      res.status(400).render('authentication/login_form', { 
        user: req.body, error: validations 
      });
    } else {
      req.login(user, loginErr => {
        if (loginErr) {
          next(loginErr)
        }
        else {
          User.findOneAndUpdate(
            { email: user.email },
            { googleAccount: true })
          .then(() => res.redirect('/'))
          .catch(next(e))
        }
      })
    }
  })(req, res, next)
}

  
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
          recoverPassEmail(user.email, user.activationToken)
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

module.exports.recoverPassword = (req,res,next) => {
  res.render("authentication/recover_pass",{token: req.params.token});
}


module.exports.doRecoverPassword = (req,res,next) => {
  function renderWithErrors(errors) {
    res.status(400).render(`authentication/recover_pass`,{
      token: req.params.token,
      errors: errors
    })
  }

  console.log(req.params)
  if(req.body.newPassword === req.body.newPassword2){
    User.findOne({activationToken:req.params.token})
      .then((user) => {
            user.password = req.body.newPassword 
            user.activationToken = uuidv4()
            return user.save()
            .then(() =>{
                res.redirect("/login")
                console.log('contraseña actualizada')
            })
          })
      .catch(error => console.log(error)) 
  }
  else { 
    console.log('Las contraseñas no coinciden')
    renderWithErrors({
      pass: 'Las contraseñas no coinciden'
    })
  }
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
    { active: true }
  )
    .then((u) => {
      if (u) {
        res.redirect("/")
      } else {
        console.log('Problems with activation')
      }
    })
    .catch((e) => next(e));
};