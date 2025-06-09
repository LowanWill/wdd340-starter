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

router.get("/classification", utilities.handleErrors(invController.builClassificationView));

router.get("/inventory", utilities.handleErrors(invController.buildInventoryView));

router.post(
  "/classification",
  invValidate.classificationRules(),
  invValidate.checkClassData,
  utilities.handleErrors(invController.processClassification)
)

router.post(
  "/inventory",
  invValidate.inventoryRules(),
  invValidate.checkInvData,
  utilities.handleErrors(invController.processInventory)
)

//error handler through footer
router.get("/error-trigger", invController.triggerError);




module.exports = router;