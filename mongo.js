const mongoose = require("mongoose");
require("dotenv").config();

mongoose.Promise = global.Promise;

console.log(process.env.MONGOURI)
  mongoose.connect(process.env.MONGOURI,{useNewUrlParser: true, useUnifiedTopology: true })




 