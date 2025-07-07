// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inv-validation');

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory item detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildInvDetail));

//Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagementView));

router.get("/add-classification", utilities.handleErrors(invController.buildClassificationView));

router.get("/add-inventory", utilities.handleErrors(invController.buildInventoryView));

router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassData,
  utilities.handleErrors(invController.addClassification)
)

router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInvData,
  utilities.handleErrors(invController.addInventory)
)

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:invId", utilities.handleErrors(invController.buildEditInventoryView))

router.post(
  '/edit-inventory',
  invValidate.inventoryRules(),
  invValidate.checkInvUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

router.get("/delete/:invId", utilities.handleErrors(invController.deleteVehicleConfirmation))

router.post("/deleteVehicle", utilities.handleErrors(invController.deleteVehicle))

//error handler through footer
router.get("/error-trigger", invController.triggerError);




module.exports = router;