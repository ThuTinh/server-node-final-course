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
    console.log("register body", req.body);

    const username = req.body.username;
    const password = req.body.password;
    const phone = req.body.phone;
    const avatar = req.body.avatar;


    if (!username || !password || !phone || !avatar) {
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
              avatar: avatar,
              phone: phone,
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
    console.log("Login body", req.body)
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
              jwt.sign(user.toJSON(), secret, {expiresIn: '365d'}, function (err, token) {
                if (err) {
                  console.log("Token loi " + err);
                  res.json({ result: 0, data: "Token loi" });
                } else {
                  //Save session
                  req.session.token = token;

                  res.json({ result: 1, token, username, avatar: user.avatar });
                }
              });
            }
          });
        } else {
          res.json({ result: 0, data: "User not exist " });
        }
      });
    }
  });

  app.get("/check-authen", function (req, res) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, secret);
    const username = decodedToken.username;
    if (!username) {
      res.status(401).json({
        result: 0,
        msg: "Invalid username " + username,
      });
    }  else {
      res.status(200).json({
        result: 1,
        msg: username,
      });
    }
  } catch (error) {
    res.status(401).json({
      result: 0,
      msg: "Invalid username " + username,
    });
  }
  });
};