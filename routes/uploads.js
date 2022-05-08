const fs = require("fs");
const multer = require("multer");

module.exports = function (app) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log("des", file);
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      var error = "",
        flag = 1;

      // 1. tồn tại file hay không : file.originalname
      const path = "./uploads/" + file.originalname;

      if (fs.existsSync(path)) {
        flag = 0;
        error = "File đã tồn tại";
      }

      // 2. định dạng : file.mimetype
      const pattern = /(image\/jpeg)|(image\/jpg)|(image\/png)/;

      if (!file.mimetype.match(pattern)) {
        flag = 0;
        error = "Không đúng định dạng";
      }

      // 3. Tổng kết
      if (flag == 1) {
        cb(null, file.originalname);
      } else {
        cb(error);
      }
    },
  });

  // const limits = { fileSize: 	2000000 }; // 100KB

  const uploads = multer({ storage, /*limits*/ }).single("avatar");
  app.post("/uploads-file", function (req, res) {
    console.log("file:", req.rawHeaders,req.file);
    console.log(res)
    uploads(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        res.send({ result: 0, err });
      } else if (err) {
        res.send({ result: 0, err });
      } else {
        res.send({ result: 1, filename: req.file.originalname});
      }
    });
  });
};
