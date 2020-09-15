const mongoose = require("mongoose");


const post_schema = mongoose.Schema({
    title:{
         type: String,
         required: true
    } ,
    description:{
        type: String,
        required: true
   },
   date:{
     type: String
     },
     color:{
          type: String
   }
    
})

module.exports = mongoose.model("Post", post_schema)