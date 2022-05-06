// JWT
var jwt = require("jsonwebtoken");
var secret = "serverapp";

module.exports =  function getUsernameFromToken(authToken) {
  const token = authToken.split(" ")[1];
  const decodedToken = jwt.verify(token, "serverapp");
  const username = decodedToken.username;
  return username;
}
