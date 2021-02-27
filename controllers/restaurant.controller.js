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
    Restaurant.find( {name: req.query.search} )
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