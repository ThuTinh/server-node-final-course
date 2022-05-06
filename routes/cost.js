const mongoose = require("mongoose");
const Cost = require("../models/cost");
const Income = require("../models/income");
const getUsernameFromToken = require("../common/getUsernameFromToken");
module.exports = function (app) {
  app.post("/costs/add", (req, res) => {
    console.log("costs add: ", req.body);
    const username = req.body.username;
    const name = req.body.name;
    const date = req.body.date;
    const costType = req.body.costType;
    const type = req.body.type;
    const cost = req.body.cost;

    if (!username || !name || !date || !costType || !type || !cost) {
      res.json({ result: 0, msg: "Invalid body" });
      return;
    }

    const costdata = new Cost({ username, name, date, costType, type, cost });
    costdata.save((err) => {
      if (err) {
        res.json({ result: 0, msg: "Save Cost failed" });
      } else {
        res.json({ result: 1, data: "Add Cost success" });
      }
    });
  });

  app.get("/costs", (req, res) => {
    let username = getUsernameFromToken(req.headers.authorization);
    if (username) {
      Cost.find(
        {
          username,
        },
        (err, docs) => {
          if (err) {
            console.log(`Error: ` + err);
            res.json({ result: 0, mgs: err });
          } else {
            res.json({ result: 1, data: docs });
          }
        }
      );
    } else {
      res.json({ result: 0, msg: "lack of username" });
    }
  });
  app.get("/costs/wallet/:walletType", (req, res) => {
    const walletType = req.params.walletType;
    const username = getUsernameFromToken(req.headers.authorization);
    if (!walletType || !username) {
      res.json({ result: 0, msg: "Lack of data" });
    } else {
      Cost.find(
        {
          username,
          type: walletType,
        },
        (err, docs) => {
          if (err) {
            console.log(`Error: ` + err);
            res.json({ result: 0, msg: "Get data failed" });
          } else {
            res.json({ result: 1, data: docs });
          }
        }
      );
    }
  });

  app.get("/costs/type/:costType", (req, res) => {
    const costType = req.params.costType;
    const username = getUsernameFromToken(req.headers.authorization);

    if (!costType || !username) {
      res.json({ result: 0, msg: "Lack of data" });
    } else {
      Cost.find(
        {
          username,
          costType,
        },
        (err, docs) => {
          if (err) {
            console.log(`Error: ` + err);
            res.json({ result: 0, msg: "Get data failed" });
          } else {
            res.json({ result: 1, data: docs });
          }
        }
      );
    }
  });
  app.get("/costs/date/:date", (req, res) => {
    const date = req.params.date;
    console.log("date", date);
    const username = getUsernameFromToken(req.headers.authorization);
    Cost.find({ date, username }, (err, docs) => {
      if (err) {
        console.log(`Error: ` + err);
        res.json({ result: 0, msg: "Find data err" });
      } else {
        res.json({ result: 1, data: docs });
      }
    });
  });
  app.get("/costs/:month/:year", (req, res) => {
    const month =
      req.params.month < 10 ? `0${req.params.month}` : req.params.month;
    const year = req.params.year;
    const username = getUsernameFromToken(req.headers.authorization);
    Cost.find(
      {
        date: { $gt: `${year}-${month}-0`, $lte: `${year}-${month}-32` },
        username,
      },
      (err, docs) => {
        if (err) {
          console.log(`Error: ` + err);
          res.json({ result: 0, msg: "Find data err" });
        } else {
          res.json({ result: 1, data: docs });
        }
      }
    );
  });

  app.get("/costs/:year", (req, res) => {
    const year = req.params.year;
    const username = getUsernameFromToken(req.headers.authorization);
    Cost.find(
      { date: { $gt: `${year}-00-0`, $lte: `${year}-12-31` }, username },
      (err, docs) => {
        if (err) {
          console.log(`Error: ` + err);
          res.json({ result: 0, msg: "Find data err" });
        } else {
          res.json({ result: 1, data: docs });
        }
      }
    );
  });

  //ToDo: Refactor later
  app.get("/total-in-out", (req, res) => {
    const username = getUsernameFromToken(req.headers.authorization);
    var totalIncomes = 0;
    var totalCosts = 0;
    Cost.find({ username }, (err, docs) => {
      if (err) {
        console.log(`Error: ` + err);
        res.json({ result: 0, msg: "Find data err" });
      } else {
        totalCosts = docs
          .map((c) => c.cost)
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0
          );
        Income.find({ username }, (err, docs) => {
          if (err) {
            console.log(`Error: ` + err);
            res.json({ result: 0, msg: "Find data err" });
          } else {
            totalIncomes = docs
              .map((i) => i.income)
              .reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                0
              );
            res.json({
              result: 1,
              data: {
                cost : totalCosts ,
                income: totalIncomes ,
              }
            });
          }
        });
      }
    });
  });
};
