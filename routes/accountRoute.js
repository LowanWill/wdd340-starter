// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')
router.get("/login",utilities.handleErrors(accountController.buildLogin))

router.get("/register",utilities.handleErrors(accountController.buildRegister))

router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checklogData,
  (req, res) => {
    res.status(200).send('login process')
  }
)
module.exports = router