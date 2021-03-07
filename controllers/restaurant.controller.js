const mongoose = require("mongoose")
const { use } = require("passport")
const passport = require('passport')

const User = require("../models/User.model")
const Restaurant = require("../models/Restaurant.model")
const Booking = require("../models/Booking.model")

const {bookingEmail} = require("../config/mailer.config")

//Show restaurants

module.exports.showRestaurants = (req,res,next) => {
    Restaurant.find()
    .populate("owner")
    .populate("likes")
    .populate("bookings")
    .then((restaurants) => {    
        res.render("restaurants/search", {restaurants: restaurants.map((r, i) => {
            r = r.toJSON();
            r.likeCount = r.likes.length;
            r.disabled = req.user ? r.owner.toString() === req.user._id.toString() : true;
            r.likedByUser = req.user ? r.likes.some((l) => l.user.toString() == req.user._id.toString()): false;
            return r;
          }),
        })
    })
    .catch((e) => next(e))
  }

//RESTAURANT FILTERS
//HOME FILTERS
module.exports.showRestaurantsByFilter = (req,res,next) => {
        Restaurant.find({$and :[{$or: [{name: { "$regex": req.query.search}},{cuisine: {"$regex": req.query.search}}] }, {$or: [{"adress.city": {"$regex": req.query.searchCity}},{"adress.zip": { "$regex": req.query.searchCity}},{"adress.country": { "$regex": req.query.searchCity}}]}] })
        .populate("owner")
        .populate("likes")
        .then((restaurants) => {  
            res.render("restaurants/search", {restaurants: restaurants.map((r, i) => {
                r = r.toJSON();
                r.likeCount = r.likes.length;
                r.disabled = req.user ? r.owner.toString() === req.user._id.toString() : true;
                r.likedByUser = req.user ? r.likes.some((l) => l.user.toString() == req.user._id.toString()): false;
                return r;
              }),
            })

        })
        .catch((e) => next(e))
    }

//SEARCH VIEW FILTERS
module.exports.showRestaurantsByPriceDes  = (req,res,next) => {
  Restaurant.find({}).sort('priceAverage')
  .populate("owner")
  .populate("likes")
  .then((restaurants) => {   
      res.render("restaurants/search", {restaurants: restaurants.map((r, i) => {
          r = r.toJSON();
          r.likeCount = r.likes.length;
          r.disabled = req.user ? r.owner.toString() === req.user._id.toString() : true;
          r.likedByUser = req.user ? r.likes.some((l) => l.user.toString() == req.user._id.toString()): false;
          return r;
        }),
      })
  })
  .catch((e) => next(e))
}
module.exports.showRestaurantsByPriceAsc = (req,res,next) => {
  Restaurant.find({}).sort('-priceAverage')
  .populate("owner")
  .populate("likes")
  .then((restaurants) => {   
      res.render("restaurants/search", {restaurants: restaurants.map((r, i) => {
          r = r.toJSON();
          r.likeCount = r.likes.length;
          r.disabled = req.user ? r.owner.toString() === req.user._id.toString() : true;
          r.likedByUser = req.user ? r.likes.some((l) => l.user.toString() == req.user._id.toString()): false;
          return r;
        }),
      })
  })
  .catch((e) => next(e))
}


module.exports.showRestaurantsByName= (req,res,next) => {
  Restaurant.find({}).sort('name')
  .populate("owner")
  .populate("likes")
  .then((restaurants) => {   
      res.render("restaurants/search", {restaurants: restaurants.map((r, i) => {
          r = r.toJSON();
          r.likeCount = r.likes.length;
          r.disabled = req.user ? r.owner.toString() === req.user._id.toString() : true;
          r.likedByUser = req.user ? r.likes.some((l) => l.user.toString() == req.user._id.toString()): false;
          return r;
        }),
      })
  })
  .catch((e) => next(e))
}






module.exports.restaurantDetail = (req,res,next) => {
    Restaurant.findById(req.params.id)
    .populate("owner")
    .populate("likes")
    .then((restaurant) => {
      console.log(restaurant)
        res.render("restaurants/restaurant-detail",{restaurant})
    })
    .catch((e) => next(e))
}

module.exports.doBooking = (req,res,next) => {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
            Booking.create({
                restaurant: req.params.id,
                user: req.user._id,
                date: req.body.date,
                hour: req.body.hour,
                number: req.body.number
              })
            .then(book =>{
                bookingEmail(user.email)
                req.flash('flashMessage', 'Your booking has been successfully processed.')
                res.redirect('/profile/bookings')

            })
            .catch(e => next(e))
        } 
        else {
          renderWithErrors({
            email: 'The email is incorrect'
          })
        }
      })
      .catch(e =>  console.log(e))
    
}



