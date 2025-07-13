const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcryptjs")
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */

async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver Account Management view
* *************************************** */

async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )


  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
 *  Process logout request
 * ************************************ */
 async function logout(req, res, next) {
  try {
    
    res.clearCookie("jwt")
    res.redirect("/")
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 *  Deliver account update view
 * ************************************ */
async function buildAccountUpdate(req, res, next) {
  try {
    let nav = await utilities.getNav()
    const accountData = await accountModel.getAccountById(req.params.account_id)
    res.render("account/update", {
      title: "Update Account",
      nav,
      accountData,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 *  Process account info update
 * ************************************ */
async function updateAccountInfo (req, res, next)  {
 
    const { account_id, account_firstname, account_lastname, account_email } = req.body
    const updateResult = await accountModel.updateAccountInfo(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    ) 
    if (updateResult) {
      req.flash("notice", "Account information updated successfully.")
      
    } else {
      req.flash("notice", "Sorry, the update failed. Please try again.")
    }
    const accountData = await accountModel.getAccountById(account_id)
    let nav = await utilities.getNav()
    res.render("account/management", {
      title: "Account Management",
      nav,
      accountData,
      errors: null
    })
  }


/* ****************************************
 *  Process password change
 * ************************************ */
async function updatePassword (req, res, next)  {
  try {
    const { account_id, new_password } = req.body
    const hashed = await bcrypt.hashSync(new_password, 12)
    await accountModel.updatePassword(account_id, hashed)
    req.flash("notice", "Password updated successfully.")
    res.redirect("/account/")
  } catch (error) { 
    next(error)
  }
}


      


module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, logout, buildAccountUpdate, updateAccountInfo, updatePassword }