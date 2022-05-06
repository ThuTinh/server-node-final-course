const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
var IncomeSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    ref: "user",
  },
  name: {
    type: String,
    required: true,
  },
  //yyyy-mm-dd
  date: {
    type: String,
    required: true,
  },
  income: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    ref: "wallet",
  },
});

//Export the model
module.exports = mongoose.model("income", IncomeSchema);
