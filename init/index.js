const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
                    
const MONGOOSE_URL = "mongodb://127.0.0.1:27017/wanderLust";

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGOOSE_URL);
}


const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj , owner: "6858f830bc201dbe0e94e44f"}));
    await Listing.insertMany(initData.data);
    console.log("data has initialized successfully");
};

initDB();

