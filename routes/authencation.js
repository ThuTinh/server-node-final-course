const mongoose = require("mongoose");
const User = require("../models/user");

// Bcrypt
const bcrypt = require("bcrypt");
const saltRounds = 10;

// JWT
var jwt = require("jsonwebtoken");
var secret = "serverapp";

// Session
var session = require("express-session");

module.exports = function (app) {
  app.use(
    session({
      secret: "serverapp",
      cookie: { maxAge: 10000 },
      resave: true,
      saveUninitialized: true,
    })
  );
  app.post("/register", (req, res) => {
    console.log("req", req.body);

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      res.json({
        result: 0,
        data: "Lack of data",
      });
    } else {
      // Check user exits
      User.findOne({ username }, (err, user) => {
        if (err) {
          console.log("Find user err: ", err);
          res.json({ result: 0, data: "Find user err" });
        } else if (user) {
          console.log("User exit");
          res.json({ result: 0, data: "User have exit" });
        } else {
          // Tao password
          bcrypt.hash(password, saltRounds, function (err, hash) {
            var newUser = new User({
              username: username,
              password: hash,
            });
            newUser.save((err) => {
              if (err) {
                res.json({ result: 0, data: "Failed to register" });
              } else {
                res.json({ result: 1, data: "Register  user success" });
              }
            });
          });
        }
      });
    }
  });
  app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      res.json({
        result: 0,
        data: "Lack of data",
      });
    } else {
      // Check user exits
      User.findOne({ username }, (err, user) => {
        if (err) {
          console.log("Find user err: ", err);
          res.json({ result: 0, data: "Find user err" });
        } else if (user) {
          // compare password
          bcrypt.compare(password, user.password, function (err, result) {
            if (err || result == false) {
              res.json({ result: 0, data: "User not exist" });
            } else {
              // Create Token
              user.password = "";
              jwt.sign(user.toJSON(), secret, {}, function (err, token) {
                if (err) {
                  console.log("Token loi " + err);
                  res.json({ result: 0, data: "Token loi" });
                } else {
                  //Save session
                  req.session.token = token;
                  res.json({ result: 1, token, username });
                }
              });
            }
          });
        }
      });
    }
  });
};
