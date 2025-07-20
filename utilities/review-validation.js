const { body, validationResult } = require("express-validator")
const utilities = require("../utilities/")

const validate = {}

/*  **********************************
*  Review Validation Rules
* ********************************* */
validate.reviewRules = () => {
    return [
        body("review_text")
        .trim()
        .notEmpty()
        .isLength({min:1})
        .withMessage("Please provide a review."),
        
    ]
    }

/*  **********************************
*   new review
* ********************************* */
validate.checkReviewData = async(req, res, next) => {
    const {
        inv_make,
        inv_model,
        review_text
    } = req.body;

    let errors = []

    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        

        res.render("reviews/reviewForm", {
            title: "Review Form",
            nav,
            inv_make,
            inv_model,
            review_text,
            errors,
        })
        return;
    
    }
    next();
}

/*  **********************************
*   Edit Review
* ********************************* */
validate.checkEditReviewData = async (req, res, next) => {
    const {
        inv_make,
        inv_model,
        review_text,
        
    } = req.body;

    let errors = []

    errors = validationResult(req);

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();


        res.render("reviews/editReview", {
            title: "Edit Review",
            nav,
            inv_make,
            inv_model,
            review_text,
            errors,
           
        });
        return;
    }
    next();
}

module.exports = validate