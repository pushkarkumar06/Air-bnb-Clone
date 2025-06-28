const { ref } = require("joi");
const mongoose = require("mongoose");       // Imports the Mongoose library into your project.  require("mongoose") loads the Mongoose module so you can use its features to define schemas, connect to MongoDB, and perform database operations.
const Schema = mongoose.Schema;  

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Review" , reviewSchema);