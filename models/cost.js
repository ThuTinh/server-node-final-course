const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var CostSchema = new mongoose.Schema({
  username: {
    type: String,
    ref: "user",
  },
  name: {
    type: String,
    required: true,
    index: true,
  },
  //yyyy-mm-dd
  date: {
    type: String,
    required: true,
  },

  /*
    Const type:
     MUST_HAVE: "Must have",
     NICE_TO_HAVE: "Nice to have",
     WASTED: "Wasted",
   */
  costType: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    ref: "wallet",
  },
  cost: {
    type: Number,
    required: true
  },
});

//Export the model
module.exports = mongoose.model("cost", CostSchema);
