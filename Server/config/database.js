const mongoose = require('mongoose');
require("dotenv").config();

exports.connect = ()=>{
    mongoose.connect(process.env.DB_URL)
    .then(()=>{
        console.log("DB connection Successful")
    })
    .catch((err)=>{
        console.log("Problem in DB connection");
        console.error(err);
        process.exit(1);

    })
} ;