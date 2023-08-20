const mongoose = require("mongoose");

const mongooseConnect = ()=>{
    mongoose.connect("mongodb://127.0.0.1:27017/shelfy")
    .then(()=>{
        console.log("Connected to MongoDB")
    })
    .catch((err)=>{
        console.log("Error connecting to mongodb: ", err)
    })
}

module.exports = mongooseConnect