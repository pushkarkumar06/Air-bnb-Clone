const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router
    .route("/")
    .get(wrapAsync(listingController.index))
    // .post(
    //     isLoggedIn,
    //     wrapAsync(listingController.createListing)
    // );
    .post( upload.single('image') , (req , res) => {
        res.send(req.file);
    });

// New route 
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        wrapAsync(listingController.destroyListing)
    );


// Edit Route 
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));

module.exports = router;