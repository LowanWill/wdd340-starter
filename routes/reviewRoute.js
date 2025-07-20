const express = require("express")
const router = new express.Router() 
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities/")
const reviewValidate = require('../utilities/review-validation');

//Reviews Routes

router.get("/reviewForm/:inv_id", utilities.checkLogin, utilities.handleErrors(reviewController.buildReview));

//Process Create new review
router.post(
    "/reviewForm",
    reviewValidate.reviewRules(),
    reviewValidate.checkReviewData,
    utilities.handleErrors(reviewController.reviewSubmission)
);

//Edit Review
router.get("/editReview/:inv_id", utilities.checkLogin, utilities.handleErrors(reviewController.buildEditReview));

//Process Edit Review
router.post(
    "/editReview",
    reviewValidate.reviewRules(),
    reviewValidate.checkReviewData,
    utilities.handleErrors(reviewController.editReview)
);

//Delete Review
router.get("/deleteReview/:inv_id", utilities.checkLogin, utilities.handleErrors(reviewController.buildDeleteReview));

//Process Delete Review
router.post(
    "/deleteReview",
    utilities.handleErrors(reviewController.deleteReview)
);

module.exports = router;