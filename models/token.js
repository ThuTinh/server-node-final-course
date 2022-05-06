const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var tokenSchema = new mongoose.Schema({
    token:{
        type:String,
        required:true,
        unique:true,
    },
  
});

//Export the model
module.exports = mongoose.model('token', tokenSchema);