const router = require("express").Router()
const passport = require('passport')
const miscController = require("../controllers/misc.controller")
const userController = require("../controllers/user.controller")
const secure = require("../middlewares/secure.middleware");

// home
router.get("/", miscController.home)

//sign up
router.get("/signup", secure.isNotAuthenticated, userController.signup)
router.post("/signup", secure.isNotAuthenticated, userController.doSignup)
router.get("/signup/verify-account", secure.isNotAuthenticated, userController.verify)

//login
router.get("/login",secure.isNotAuthenticated, userController.login)
router.post("/login",secure.isNotAuthenticated, userController.doLogin)
router.get("/login/forgot-password",secure.isNotAuthenticated, userController.forgotpass)
router.post("/login/forgot-password",secure.isNotAuthenticated, userController.doForgotpass)


//logout
router.post("/logout",secure.isAuthenticated, userController.logout)

// USER PROFILE
//profile main page
router.get("/profile", secure.isAuthenticated, userController.profile)

//personal information
router.get("/userinformation", secure.isAuthenticated, userController.userInformation)

//user bookings
router.get("/bookings", secure.isAuthenticated, userController.userBookings)

//user favourites
router.get("/userfavourites", secure.isAuthenticated, userController.userFavourites)

//user reviews
router.get("/userreviews", secure.isAuthenticated, userController.userReviews)

//Activate account
router.get('/activate/:token',secure.isNotAuthenticated, userController.activate)




module.exports = router;