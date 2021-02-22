const router = require("express").Router()

const miscController = require("../controllers/misc.controller")
const userController = require("../controllers/user.controller")

// home
router.get("/", miscController.home)

//sign up
router.get("/signup", userController.signup)
router.post("/signup", userController.doSignup)

// login
router.get("/login", userController.login)
//router.post("/login", userController.doLogin)



//Activate account
router.get('/activate/:token', userController.activate)

module.exports = router;