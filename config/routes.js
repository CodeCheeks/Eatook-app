const router = require("express").Router()
const passport = require('passport')
const miscController = require("../controllers/misc.controller")
const userController = require("../controllers/user.controller")
const authController = require("../controllers/auth.controller")
const secure = require("../middlewares/secure.middleware");

// home
router.get("/", miscController.home)

//sign up
router.get("/signup", secure.isNotAuthenticated, authController.signup)
router.post("/signup", secure.isNotAuthenticated, authController.doSignup)
router.get("/signup/verify-account", secure.isNotAuthenticated, authController.verify)

//login
router.get("/login",secure.isNotAuthenticated, authController.login)
router.post("/login",secure.isNotAuthenticated, authController.doLogin)
router.get("/login/forgot-password",secure.isNotAuthenticated, authController.forgotpass)
router.post("/login/forgot-password",secure.isNotAuthenticated, authController.doForgotpass)

//logout
router.post("/logout",secure.isAuthenticated, authController.logout)

// USER PROFILE

//profile main page
router.get("/profile", secure.isAuthenticated, userController.profile)

//personal information
router.get("/profile/personal-info", secure.isAuthenticated, userController.userInformation)
//Edit password
router.post("/profile/personal-info/password", secure.isAuthenticated, userController.doChangePass)
//Edit phone number
router.post("/profile/personal-info/phonenumber", secure.isAuthenticated, userController.doChangePhone)

//user bookings
router.get("/profile/bookings", secure.isAuthenticated, userController.userBookings)

//user favourites
router.get("/profile/favourites", secure.isAuthenticated, userController.userFavourites)

//user reviews
router.get("/profile/reviews", secure.isAuthenticated, userController.userReviews)

//Activate account
router.get('/activate/:token',secure.isNotAuthenticated, authController.activate)

//owner
router.get("/add-restaurant", secure.isAuthenticated, userController.addRestaurant)
router.post("/add-restaurant", secure.isAuthenticated, userController.doAddRestaurant)



module.exports = router;