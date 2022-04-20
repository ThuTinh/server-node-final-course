export const checkAuthentication = function (req, res, next) {
    if (req.session.token) {
      // Verify
      jwt.verify(req.session.token, secret, function (err, decoded) {
        if (err) {
          console.log("Token sai");
          res.redirect("./login");
        } else {
          req.currentUser = decoded;
          return next();
        }
      });
    } else {
      console.log("Khong tim thay session");
      res.redirect("./login");
    }
  };