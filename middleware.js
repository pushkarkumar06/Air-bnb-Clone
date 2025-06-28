module.exports.isLoggedIn = (req , res , next) => {
    console.log(req.path , ".." , req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "You must be logged to add the listing");
        return res.redirect("/login");

    }
    next();
};



module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // ✅ Fix here
    }
    next();
};
