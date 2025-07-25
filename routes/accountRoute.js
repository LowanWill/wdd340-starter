// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')


router.get("/login",utilities.handleErrors(accountController.buildLogin))

router.get("/register",utilities.handleErrors(accountController.buildRegister))

router.get("/",utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

//Process the login data
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checklogData,
  utilities.handleErrors(accountController.accountLogin)
)
//Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

router.get("/logout", utilities.handleErrors(accountController.logout))

// Update view
router.get("/update/:account_id", utilities.handleErrors(accountController.buildAccountUpdate))
// Process account update
router.post(
  "/update",
  regValidate.accountUpdateRules(),
  regValidate.checkUpdateData, utilities.handleErrors(accountController.updateAccountInfo)
)

// Process password change
router.post(
  "/update-password",
  regValidate.passwordUpdateRules(),
  regValidate.checkPasswordUpdateData,
  utilities.handleErrors(accountController.updatePassword)
)


module.exports = router