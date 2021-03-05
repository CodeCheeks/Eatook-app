const mongoose = require("mongoose")
const User = require("../models/User.model")
const Restaurant = require("../models/Restaurant.model")
const { sendActivationEmail } = require("../config/mailer.config")


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

module.exports.doChangePhone = (req,res,next) => {
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
  .catch(error => console.log(error))
}



module.exports.doChangeEmail = (req,res,next) => {
  function renderWithErrors(errors) {
    res.status(400).render('users/user_information', {
      errors: errors,
    })
  }
  User.findOneAndUpdate(
    {_id: req.user._id},
    {email: req.body.email, active:false},
    {new:true})
  .then((user) => {
    if(user){

    sendActivationEmail(user.email,user.activationToken)
    req.logout();
    res.redirect("/signup/verify-account");
    
    
    console.log(`The email has been updated`)
    }
    else{
      renderWithErrors('There was an error with the new provided email')
    }
  })
  .catch(error => console.log(error))
}


//Profile 

module.exports.userBookings = (req, res, next) => {
  res.render("users/user_bookings")
}

module.exports.userFavourites = (req, res, next) => {
  res.render("users/user_favourites")
}

module.exports.userReviews = (req, res, next) => {
  res.render("users/user_reviews")
}


module.exports.userHelp = (req, res, next) => {
  res.render("users/user_help")
}


module.exports.userListRestaurants = (req, res, next) => {
  User.findById(req.user._id)
  .populate('restaurants')
  .then((user) => {
    res.render("users/owner/list_restaurants",{user})
})
.catch((e) => next(e))
  
}

//RESTAURANTS CRUD

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
    res.redirect('/profile/restaurants')
    req.user.restaurants.push(restaurant._id)
    User.findByIdAndUpdate(req.user._id, {restaurants: req.user.restaurants})
    .then(
      //console.log(req.user.restaurants)
    )
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


module.exports.editRestaurant = (req, res, next) => {
  Restaurant.findById({_id: req.params.id})
  .then((restaurant) => {
    res.render("users/owner/add_restaurant", {restaurant})
  })
  .catch((e) => console.log(e))
  
}



module.exports.doEditRestaurant = (req, res, next) => {
  function renderWithErrors(errors) {
    res.status(400).render('/add-restaurant', {
      errors: errors,
      user: req.body
    })
  }

  if (req.file) {
    req.body.image = req.file.path;
  }

  Restaurant.findById({_id: req.params.id})
  .then(restaurant => {

    restaurant.name = req.body.name 
    restaurant.cuisine = req.body.cuisine 
    restaurant.image.push(req.body.image) 

    restaurant.timeTable.days = req.body['timeTable.days']
    restaurant.timeTable.openhour = req.body['timeTable.openhour']
    restaurant.timeTable.closehour = req.body['timeTable.closehour']

    restaurant.adress.country = req.body['adress.country']
    restaurant.adress.city = req.body['adress.city']
    restaurant.adress.street = req.body['adress.street']
    restaurant.adress.zip = req.body['adress.zip']

    restaurant.save()
    res.redirect('/profile/restaurants')
  })
  .catch(e => {
    if (e instanceof mongoose.Error.ValidationError) {
      renderWithErrors(e.errors)
    } else {
      renderWithErrors(e)
    }
  })

}

module.exports.doDeleteRestaurant =(req, res, next) => {
  Restaurant.findByIdAndDelete({_id:req.params.id})
  .then((restaurant) => {
  console.log(`The restaurant ${restaurant.name} has been deleted`)
  res.redirect('/profile/restaurants')
})
  .catch(e => console.log(e))
}



module.exports.favourites = (req, res, next) => {
  Like.find({ user: req.user._id })
    .populate("restaurant")
    .then((likes) => {
      res.render("users/user_favourites", {
        restaurants: likes.map((l) => {
          return { ...l.toJSON().restaurant, likedByUser: true };
        }),
      });
    })
    .catch((e) => console.log(e));
};
