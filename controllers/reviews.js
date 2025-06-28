const Listing = require("../models/listing");
const Review = require("../models/review"); 


module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id; // ✅ Set the author to logged-in user

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }

    // ✅ Only author can delete
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not authorized to delete this review");
        return res.redirect(`/listings/${id}`);
    }

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};

module.exports.editReview = async (req, res) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        throw new ExpressError(404, "Review not found");
    }

    // ✅ Add ownership check here too
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not allowed to edit this review");
        return res.redirect(`/listings/${id}`);
    }

    res.render("review_edit/edit_review.ejs", { listingId: id, review });
};


module.exports.putReview = async (req, res) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review.author.equals(req.user._id)) {
        req.flash("error", "Unauthorized update attempt");
        return res.redirect(`/listings/${id}`);
    }

    await Review.findByIdAndUpdate(reviewId, req.body.review);
    res.redirect(`/listings/${id}`);
};