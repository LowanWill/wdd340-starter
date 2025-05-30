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

module.exports = invCont