const mongoose = require("mongoose")
//require model
const User = require("../models/User.model")


//user login
module.exports.login = (req,res,next) => {
    res.render('authentication/login_form')
}


