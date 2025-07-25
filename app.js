if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); // ✅ Correct relative path and extension not required in CommonJS
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const MONGOOSE_URL = "mongodb://127.0.0.1:27017/wanderLust";

main()
    .then(() => {
        console.log("connected to DB");
        app.listen(8080, () => {
            console.log("server is listing on port 8080");
        });
    })
    .catch((err) => {
        console.log("DB connection failed");
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGOOSE_URL);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret : "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.get("/", (req, res) => {
    res.send("Hi, I am Pushkar Kumar");
});

app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req , res , next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;  // <-- now it matches your EJS
    next();
});


// Middleware to validate review with Joi
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
};


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/" , userRouter);


app.use((err, req, res, next) => {
    let { statusCode = 505, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});


app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});


