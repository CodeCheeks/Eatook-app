const mongoose = require("mongoose")
const { use } = require("passport")
const passport = require('passport')
const User = require("../models/User.model")
const Restaurant = require("../models/Restaurant.model")

//Show restaurants

module.exports.showRestaurants = (req,res,next) => {
    Restaurant.find()
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
    

module.exports.restaurantDetail = (req,res,next) => {
    Restaurant.findById(req.params.id)
    .populate("owner")
    .then((restaurant) => {
        res.render("restaurants/restaurant-detail",{restaurant})
    })
}