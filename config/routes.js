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
router.get("/ABOUT", miscController.about)

/* ---- Authenticate ---- */

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

//logout
router.get("/logout",secure.isAuthenticated, authController.logout)

//recover password
router.post('/forgot-password/:token',secure.isNotAuthenticated, authController.doRecoverPassword)
router.get('/forgot-password/:token',secure.isNotAuthenticated, authController.recoverPassword)

//Activate account
router.get('/activate/:token', authController.activate)

/* ---- USER PROFILE ---- */
router.get("/profile/personal-info", secure.isAuthenticated, userController.userInformation)
router.get("/profile/help", secure.isAuthenticated, userController.userHelp)

// role: user
router.get("/profile", secure.isAuthenticated, userController.profile)
router.get("/profile/bookings", secure.isAuthenticated, userController.userBookings)
router.get("/profile/favourites", secure.isAuthenticated, userController.userFavourites)
router.get("/profile/reviews", secure.isAuthenticated, userController.userReviews)
router.get("/profile/favourites", secure.isAuthenticated, userController.favourites);
router.post("/update-booking/:id", secure.isAuthenticated, userController.doUpdateBooking)
router.post("/delete-booking/:id", secure.isAuthenticated, userController.doDeleteBooking)

//role: owner
router.get("/add-restaurant", secure.isAuthenticated, secure.checkRole('owner'), userController.addRestaurant)
router.post("/add-restaurant", secure.isAuthenticated, secure.checkRole('owner'), upload.single('image'), userController.doAddRestaurant)
router.get("/profile/restaurants", secure.isAuthenticated, secure.checkRole('owner'), userController.userListRestaurants)
router.get("/edit-restaurant/:id", secure.isAuthenticated, secure.checkRole('owner'), userController.editRestaurant)
router.post("/edit-restaurant/:id", secure.isAuthenticated,secure.checkRole('owner'),upload.single('image'), userController.doEditRestaurant)
router.post("/delete-restaurant/:id", secure.isAuthenticated,secure.checkRole('owner'), userController.doDeleteRestaurant)

router.post("/booking-contact/:id", secure.isAuthenticated,secure.checkRole('owner'), userController.contactBooking)


//personal information edit
router.post("/profile/personal-info/password", secure.isAuthenticated, userController.doChangePass)
router.post("/profile/personal-info/phonenumber", secure.isAuthenticated, userController.doChangePhone)
router.post("/profile/personal-info/email", secure.isAuthenticated, userController.doChangeEmail)

//likes
router.get("/restaurant/:id/like", miscController.like);



/* ---- RESTAURANTS ---- */

//Search all list

router.get("/search", restaurantController.showRestaurants)

//Search with filters

router.get("/search-by-filter", restaurantController.showRestaurantsByFilter)
router.get("/search-by-price-descending", restaurantController.showRestaurantsByPriceDes)
router.get("/search-by-price-ascending", restaurantController.showRestaurantsByPriceAsc)
router.get("/search-by-name", restaurantController.showRestaurantsByName)



//Restaurant detail

router.get("/restaurant/:id", restaurantController.restaurantDetail)
router.post("/restaurant/:id/booking", restaurantController.doBooking)
router.post("/restaurant/:id/review", restaurantController.doReview)




module.exports = router;