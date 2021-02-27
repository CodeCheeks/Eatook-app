const mongoose = require("mongoose")
const { use } = require("passport")
const passport = require('passport')
const User = require("../models/User.model")
const Restaurant = require("../models/Restaurant.model")

//Show restaurants

module.exports.showRestaurants = (req,res,next) => {
    Restaurant.find()
    .then((restaurants) => {
        res.render("restaurants/search", {restaurants})
    })
    .catch((e) => next(e))
  }

module.exports.showRestaurantsByName = (req,res,next) => {
    Restaurant.find( {$or: [{name: req.query.search},{cuisine: req.query.search}] })
    .then((restaurants) => {
        console.log(restaurants)
        res.render("restaurants/search", {restaurants})
    })
    .catch((e) => next(e))
  }

module.exports.showRestaurantsByCity = (req,res,next) => {
    Restaurant.find( {$or: [{"adress.city": req.query.searchCity},{"adress.zip": req.query.searchCity},{"adress.country": req.query.searchCity}] })
    .then((restaurants) => {
        console.log(restaurants)
        res.render("restaurants/search", {restaurants})
    })
    .catch((e) => next(e))
  }


module.exports.restaurantDetail = (req,res,next) => {
    Restaurant.findById(req.params.id)
    .then((restaurant) => {
        res.render("restaurants/restaurant-detail",{restaurant})
    })
}