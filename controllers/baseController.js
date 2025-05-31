const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  //req.flash("notice", "This is a flash message.")    -- this is how you add a flash message from a controller to a view
  res.render("index", {title: "Home", nav})
}

module.exports = baseController