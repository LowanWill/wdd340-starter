const reviewModel = require('../models/review-model');
const utilities = require('../utilities');
const invModel = require("../models/inventory-model")

const reviewController = {}

/* ***************************
 *  Build review form view
 * ************************** */

reviewController.buildReview = async function (req, res, next) {
  let nav = await utilities.getNav();
  const inv_id = req.params.inv_id;
  const account_id = res.locals.accountData.account_id;

  const data = await invModel.getInvById(inv_id);
  if (!data) {
    req.flash("notice", "Vehicle not found.");
    return res.redirect("/inv/");
  }

  res.render('reviews/reviewForm', {
    title: 'Submit Review',
    nav,
    inv_make: data.inv_make,
    inv_model: data.inv_model,
    account_id,
    inv_id,
    review_text: "",
    errors: null,
  });
}


/* ***************************
 *  Process Review Submission
 * ************************** */

reviewController.reviewSubmission = async function (req, res, next) {
   let nav = await utilities.getNav();

   const { account_id, inv_id, inv_make, inv_model, review_text } = req.body;

   const databaseResult = await reviewModel.addReview(
       account_id,
         inv_id,
         review_text)

    if (databaseResult) {
        req.flash ('notice', 'Review submitted successfully.');
        res.redirect(`/inv/detail/${inv_id}`);
    } else {
        req.flash('notice', 'There was a problem submitting your review.');
        res.status(501).render('reviews/reviewForm', {
            title: 'Submit Review',
            nav,
            inv_make,
            inv_model,
            account_id,
            inv_id,
            review_text,
            errors: null,
        });
    }
    }

    /* ***************************
    *  Build edit review view
    * ************************** */

reviewController.buildEditReview = async function (req, res, next) {
    let nav = await utilities.getNav();
    const inv_id = req.params.inv_id;
    const account_id = res.locals.accountData.account_id;

    const invData = await invModel.getInvById(inv_id);
    if (!invData) {
  req.flash("notice", "Vehicle not found.");
  return res.redirect("/inv/");
}
    const reviewData = await reviewModel.getUserReview(account_id, inv_id);
    
   
    res.render('reviews/editReview', {
        title: 'Edit Review',
        nav,
        inv_make: invData.inv_make,
        inv_model: invData.inv_model,
        account_id,
        inv_id,
        review_text: reviewData.review_text,
        errors: null,
    });
}

/* ***************************
 *  Process edit review
 * ************************** */

reviewController.editReview = async function (req, res, next) {
    let nav = await utilities.getNav();
    
    const { account_id, inv_id, inv_make, inv_model, review_text } = req.body;

    const databaseResult = await reviewModel.editReview(
        account_id,
        inv_id,
        review_text
    );
    if (databaseResult) {
        req.flash('notice', 'Review updated successfully.');
        res.redirect(`/inv/detail/${inv_id}`);
    } else {
        req.flash('notice', 'There was a problem updating your review.');
        res.status(501).render('reviews/editReview', {
            title: 'Edit Review',
            nav,
            inv_make,
            inv_model,
            account_id,
            inv_id,
            review_text,
            errors: null,
        });
    }
}

/* ***************************
 *  Build Delete Review view
 * ************************** */

reviewController.buildDeleteReview = async function (req, res, next) {
    let nav = await utilities.getNav();
    const inv_id = req.params.inv_id;
    const account_id = res.locals.accountData.account_id;

    const invData = await invModel.getInvById(inv_id);
    if (!invData) {
  req.flash("notice", "Vehicle not found.");
  return res.redirect("/inv/");
}
   
    res.render('reviews/deleteReview', {
        title: 'Delete Review',
        nav,
        inv_make: invData.inv_make,
        inv_model: invData.inv_model,
        account_id,
        inv_id,
        errors: null,
    });
}

/* ***************************
 *  Process Delete Review
 * ************************** */

reviewController.deleteReview = async function (req, res, next) {
    let nav = await utilities.getNav();
    
    const { account_id, inv_id, inv_make, inv_model } = req.body;

    const databaseResult = await reviewModel.deleteReview(account_id, inv_id);

    if (databaseResult) {
        req.flash('notice', 'Review deleted successfully.');
        res.redirect(`/inv/detail/${inv_id}`);
    } else {
        req.flash('notice', 'There was a problem deleting your review.');
        res.status(501).render('reviews/deleteReview', {
            title: 'Delete Review',
            nav,
            errors: null,
            inv_make,
            inv_model,
            inv_id,
            account_id,
        });
    }
}

module.exports = reviewController;