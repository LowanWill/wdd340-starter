const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

/* ***************************
 *  Build inventory item detail view
 * ************************** */

invCont.buildInvDetail = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInvById(inv_id)
  const nav = await utilities.getNav()
  const vehicle = Array.isArray(data) ? data[0] : data
  const detail = await utilities.buildDetail(vehicle)
  
  const title = `${vehicle.inv_make} ${vehicle.inv_model}`
  res.render("./inventory/itemDetail", {
    title: title,
    nav,
    detail,
    errors: null,
  })
}

/* ***************************
 * Add classification 
 * ************************** */
invCont.processClassification = async function (req, res, next) {
  const { classification_name } = req.body
  const regClassification = await invModel.addClassification(classification_name)
  const nav = await utilities.getNav()
  if (regClassification) {
    req.flash(
      "notice",
      `Congratulations, you have added a classification.`
    )
    res.status(201).render("inventory/add-classification", {
      title: "Vehicle Classification",
      nav,
      errors: null,
    })
  } else {
    
    req.flash("notice", "Sorry, add classification failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Vehicle Classification",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 * Add inventory item
 * ************************** */
invCont.processInventory = async function (req, res, next) {
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  const regInventory = await invModel.addInventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
  const nav = await utilities.getNav()
  if (regInventory) {
    req.flash(
      "notice",
      `Congratulations, you have added a new inventory item.`
    )
    res.status(201).render("inventory/add-inventory", {
      title: "Vehicle Inventory",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, add inventory failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Vehicle Inventory",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Trigger an error for testing
 * ************************** */
invCont.triggerError = (req, res, next) => {
  try {
    const error = new Error();
    error.status = 500;
    throw error;
  } catch (error) {
    next(error);
  }
};

module.exports = invCont