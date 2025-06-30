const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
    try {
        console.log("📥 Incoming form data:", req.body);
        console.log("📷 File received from Multer:", req.file);

        const listing = new Listing(req.body.listing);
        listing.owner = req.user._id;

        if (req.file) {
            listing.image = {
                url: req.file.path,
                filename: req.file.filename
            };
        }

        console.log("🛠 Final Listing Object before saving:", listing);

        await listing.save();

        console.log("✅ Listing saved successfully!");
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    } catch (err) {
        console.error("❌ Error while saving listing:", err);
        next(err); // Pass to Express error handler middleware
    }
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    console.log("👁 Showing Listing:", listing);
    res.render("listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log("🗑 Deleted Listing:", deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};
