const router = require("express").Router()

const miscController = require("../controllers/misc.controller")
const userController = require("../controllers/user.controller")

// home
router.get("/", miscController.home)

// login
router.get("/login", userController.login)
//router.post("/login", userController.doLogin)


module.exports = router;