const mongoose = require("mongoose")
const User = require("../models/User.model")
const Restaurant = require("../models/Restaurant.model")



//Profile

module.exports.profile = (req,res,next) => {
  res.render("users/profile")
}

module.exports.userInformation = (req, res, next) => {
  res.render("users/user_information")
}


// Change password

module.exports.doChangePass = (req,res,next) => {

  function renderWithErrors(errors) {
    res.status(400).render('users/user_information', {
      errors: errors,
    })
  }

  if(req.body.newPassword === req.body.newPassword2){
    User.findById(req.user._id)
      .then((user) => {
        user.checkPassword(req.body.oldPassword)
        .then(match =>{
          if (match) {
            user.password = req.body.newPassword 
            user.save()
            res.render("users/user_information")
            console.log('contraseña actualizada')
          }
          else{
            console.log('contraseña incorrecta')
            renderWithErrors({
              incorrectPass: 'Wrong password'
            })
          }
        })
        .catch((e) => next(e))
        
      })
      .catch(error => console.log(error));
  }
  else { 
    console.log('Las contraseñas no coinciden')// TODO NO RENDERIZA LA VISTA CON ERRORES
    renderWithErrors({
      pass: 'Las contraseñas no coinciden'
    })
  }
}

//Edit phonenumber

module.exports.doChangePhone = 
(req,res,next) => {

  function renderWithErrors(errors) {
    res.status(400).render('users/user_information', {
      errors: errors,
    })
  }
  
  User.findOneAndUpdate({_id: req.user._id},{phonenumber: req.body.phonenumber},{new:true})
  .then((newNumber) => {
    if(newNumber){
    res.redirect('/profile/personal-info')
    console.log(`The new numberphone: ${newNumber.phonenumber} has been updated`)
    }
    else{
      renderWithErrors('There was an error with the new provided phonenumber')
    }
  })
  .catch((err) => {
    console.log(err)
  })
  

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


//Restaurant



module.exports.addRestaurant = (req, res, next) => {
  res.render("users/owner/add_restaurant")
}


module.exports.doAddRestaurant = (req, res, next) => {
  function renderWithErrors(errors) {
    res.status(400).render('/add-restaurant', {
      errors: errors,
      user: req.body
    })
  }

  if (req.file) {
    req.body.image = req.file.path;
  }

  Restaurant.create(req.body)
  .then(restaurant => {
    res.redirect('/')
    restaurant.owner = req.user.id
    restaurant.save()
    
  })
  .catch(e => {
    if (e instanceof mongoose.Error.ValidationError) {
      renderWithErrors(e.errors)
    } else {
      next(e)
    }
  })

}
