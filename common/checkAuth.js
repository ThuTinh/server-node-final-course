// JWT
var jwt = require("jsonwebtoken");
var secret = "serverapp";
module.exports = function authChecker(req, res, next) {
  try {
    if (req.path == "/login" || req.path == "/register" || req.path == "/uploads-file") {
      next();
    } else {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, secret);
      const username = decodedToken.username;
      console.log("authChecker", username);
      if (!username) {
        res.status(401).json({
          result: 0,
          msg: "Invalid username " + username,
        });
      } else {
        next();
      }
    }
  } catch {
    res.status(401).json({
      result: 0,
      msg: "Invalid request!",
    });
  }
};
