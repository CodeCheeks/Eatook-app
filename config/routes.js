const router = require("express").Router()
const passport = require('passport')
const miscController = require("../controllers/misc.controller")
const userController = require("../controllers/user.controller")
const authController = require("../controllers/auth.controller")
const restaurantController = require("../controllers/restaurant.controller")
const secure = require("../middlewares/secure.middleware");

const upload = require('./storage.config')

const GOOGLE_SCOPES = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']

// home
router.get("/", miscController.home)

//sign up
router.get("/signup", secure.isNotAuthenticated, authController.signup)
router.post("/signup", secure.isNotAuthenticated, authController.doSignup)
router.get("/signup/verify-account", authController.verify)

//login
router.get("/login",secure.isNotAuthenticated, authController.login)
router.post("/login",secure.isNotAuthenticated, authController.doLogin)
router.get("/authenticate/google", passport.authenticate('google-auth', { scope: GOOGLE_SCOPES }))
router.get("/authenticate/google/callback", authController.doLoginGoogle)
router.get("/login/forgot-password",secure.isNotAuthenticated, authController.forgotpass)
router.post("/login/forgot-password",secure.isNotAuthenticated, authController.doForgotpass)


//recover password
router.post('/forgot-password/:token',secure.isNotAuthenticated, authController.doRecoverPassword)
router.get('/forgot-password/:token',secure.isNotAuthenticated, authController.recoverPassword)

//logout
router.post("/logout",secure.isAuthenticated, authController.logout)

// USER PROFILE

//profile main page
router.get("/profile", secure.isAuthenticated, userController.profile)

//personal information
router.get("/profile/personal-info", secure.isAuthenticated, userController.userInformation)
router.post("/profile/personal-info/password", secure.isAuthenticated, userController.doChangePass)
router.post("/profile/personal-info/phonenumber", secure.isAuthenticated, userController.doChangePhone)
router.post("/profile/personal-info/email", secure.isAuthenticated, userController.doChangeEmail)



//user bookings
router.get("/profile/bookings", secure.isAuthenticated, userController.userBookings)

//user favourites
router.get("/profile/favourites", secure.isAuthenticated, userController.userFavourites)

//user reviews
router.get("/profile/reviews", secure.isAuthenticated, userController.userReviews)

//Activate account
router.get('/activate/:token', authController.activate)

//owner
router.get("/add-restaurant", secure.isAuthenticated, secure.checkRole('owner'), userController.addRestaurant)
router.post("/add-restaurant", secure.isAuthenticated, upload.single('image'), userController.doAddRestaurant)//user bookings
router.get("/profile/restaurants", secure.isAuthenticated, secure.checkRole('owner'), userController.userListRestaurants)

//RESTAURANTS

//Search all list

router.get("/search", restaurantController.showRestaurants)

//Search with filters

router.get("/search-by-filter", restaurantController.showRestaurantsByFilter)


//Restaurant detail

router.get("/restaurant/:id", restaurantController.restaurantDetail)
module.exports = router;