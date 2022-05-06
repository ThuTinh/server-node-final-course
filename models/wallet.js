const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var WalletSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
    unique: true,
  },
  percent: {
    type: Number,
    required: true,
  },
});

//Export the model
module.exports = mongoose.model("wallet", WalletSchema);
