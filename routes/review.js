const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schema");
const Listing = require("../models/listing");
const Review = require("../models/review");
const { isLoggedIn } = require("../middleware");

// GET: /listings/:id/reviews — Show all reviews for a listing
router.get("/", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    });

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    res.render("reviews/show_reviews.ejs", { listing });
}));


// Joi validation middleware
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

const reviewController = require("../controllers/reviews.js");


// POST: /listings/:id/reviews
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// DELETE: /listings/:id/reviews/:reviewId
router.delete("/:reviewId", isLoggedIn, wrapAsync(reviewController.destroyReview));

// EDIT: /listings/:id/reviews/:reviewId/edit
router.get("/:reviewId/edit", isLoggedIn, wrapAsync(reviewController.editReview));

// PUT: /listings/:id/reviews/:reviewId
router.put("/:reviewId", isLoggedIn, validateReview, wrapAsync(reviewController.putReview));


module.exports = router;

