const router = require("express").Router()
const passport = require('passport')
const miscController = require("../controllers/misc.controller")
const userController = require("../controllers/user.controller")
const secure = require("../middlewares/secure.middleware");
// home
router.get("/", miscController.home)

//sign up
router.get("/signup",secure.isNotAuthenticated, userController.signup)
router.post("/signup",secure.isNotAuthenticated, userController.doSignup)

//login
router.get("/login",secure.isNotAuthenticated, userController.login)
router.post("/login",secure.isNotAuthenticated, userController.doLogin)

//logout
router.post("/logout",secure.isAuthenticated, userController.logout)

// profile
router.get("/profile", secure.isAuthenticated, userController.profile)

//Activate account
router.get('/activate/:token',secure.isNotAuthenticated, userController.activate)




module.exports = router;