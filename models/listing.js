const mongoose = require("mongoose");       // Imports the Mongoose library into your project.  require("mongoose") loads the Mongoose module so you can use its features to define schemas, connect to MongoDB, and perform database operations.
const review = require("./review");
const { ref, string } = require("joi");
const Schema = mongoose.Schema;     //Extracts the Schema constructor from Mongoose.

const listingSchema = new Schema({      // listingSchema is a blueprint (schema) for documents in a MongoDB collection.
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        // filename: String,
        // url: {
        //     type: String,
        //     default:
        //         "https://imgs.search.brave.com/VPhfzux73mvlD8rc--U88wh5Jc9MNEdgvcCUkQ7tgDk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDExMjM5/NzgwLmpwZw",
        //     set: (v) => v === "" ? "https://imgs.search.brave.com/VPhfzux73mvlD8rc--U88wh5Jc9MNEdgvcCUkQ7tgDk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDExMjM5/NzgwLmpwZw" : v,
        // }
        url: String,
        filename: String,
    },


    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

const Listing = mongoose.model("Listing", listingSchema);      //Creates a Mongoose model named "Listing" using the schema listingSchema.
module.exports = Listing;

