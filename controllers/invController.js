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
 *  Build inventory management view 
  * ************************** */
 invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()

  const classificationSelect = await utilities.buildClassificationList()
  const classifications = await invModel.getClassifications()

  res.render("inventory/management",{
    title: "Vehicle Management",
    nav,
    classificationSelect,
    classifications,
    errors: null,
    
  })
}

invCont.buildClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Vehicle Classification",
    nav,
    errors: null
     
})
}


invCont.buildInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Vehicle Inventory",
    nav,
    classificationList,
    errors: null
  })
}

/* ***************************
 * Add classification 
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  const newClassification = await invModel.addClassification(classification_name)
  
  if (newClassification) {
    req.flash(
      "notice",
      `Congratulations, you have added a classification.`
    )
    
    const classificationSelect = await utilities.buildClassificationList()
    const classifications = await invModel.getClassifications()
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationSelect,
      classifications,
      errors: null,
    })
  } else {
    
    req.flash("notice", "Sorry, add classification failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Vehicle Classification",
      nav,
      classification_name,
      errors: null      
    })
  }
}

/* ***************************
 * Add inventory item
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  //const list = await utilities.buildClassificationList()
  let { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  const newInventory = await invModel.addInventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
   if (newInventory) {
  req.flash(
    "notice",
    `Congratulations, you have added a new inventory item.`
  )
  const classificationSelect = await utilities.buildClassificationList()
  const classifications = await invModel.getClassifications()
  res.status(201).render("inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect,
    classifications,
    errors: null,
      
    })
  } else {
    req.flash("notice", "Sorry, add inventory failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Vehicle Inventory",
      nav,
      classificationList,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build Edit Inventory View
 * ************************** */
invCont.buildEditInventoryView = async function(req, res, next) {
  const inv_id = req.params.invId
  const nav = await utilities.getNav()
  const data = await invModel.getInvById(inv_id)
  const list = await utilities.buildClassificationList(data.classification_id)
  
  const title = `${data.inv_make} ${data.inv_model}`
  
    res.render("inventory/edit-inventory", {
      title: "Edit " + title,
      nav,
      list,
      data,
      errors: null,
      inv_id:data.inv_id,
      inv_make:data.inv_make,
      inv_model:data.inv_model, 
      inv_year:data.inv_year,
      inv_description:data.inv_description,
      inv_image:data.inv_image, 
      inv_thumbnail:data.inv_thumbnail,
      inv_price:data.inv_price,
      inv_miles:data.inv_miles,
      inv_color:data.inv_color,
      classification_id:data.classification_id,
    })
 
  }

  /* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}


module.exports = invCont