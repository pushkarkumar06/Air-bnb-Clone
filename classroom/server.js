const express = require("express");
const app = express();


app.get("/" , (req , res) => {
    res.send("HI , i am pushkar kumar");
});

app.listen(3000 , () =>{
    console.log("server is listing to port number -> 3000");
})