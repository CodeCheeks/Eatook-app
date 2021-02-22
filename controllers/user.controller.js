const mongoose = require("mongoose")
//require model
const User = require("../models/User.model")


// login
module.exports.login = (req,res,next) => {
    res.render('authentication/login_form')
}


// signup

module.exports.signup = (req,res,next) => {
    res.render('authentication/signup_form')
}

module.exports.doSignup = (req,res,next) => {
    console.log('The form data: ', req.body);
}
