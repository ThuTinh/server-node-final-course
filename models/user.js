const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
  username: String,
  password: String,
  phone: String,
  avatar: String,
});

module.exports = mongoose.model("user", UserSchema);
