const mongoose = require("mongoose");
const Income = require("../models/income");
const Cost = require("../models/cost");
const getUsernameFromToken = require("../common/getUsernameFromToken");
const _ = require("lodash");
module.exports = function (app) {
  app.post("/incomes/add", (req, res) => {
    const username = req.body.username;
    const name = req.body.name;
    const date = req.body.date;
    const income = req.body.income;
    const type = req.body.type;

    if (!username || !name || !date || !type || !income) {
      res.json({ result: 0, msg: "Invalid body" });
      return;
    }

    const costdata = new Income({ username, name, date, type, income });
    costdata.save((err) => {
      if (err) {
        res.json({ result: 0, msg: "Save Income failed" });
      } else {
        res.json({ result: 1, data: "Add Income success" });
      }
    });
  });
  app.get("/incomes", (req, res) => {
    let username = getUsernameFromToken(req.headers.authorization);
    if (username) {
      Income.find(
        {
          username,
        },
        (err, docs) => {
          if (err) {
            console.log(`Error: ` + err);
            res.json({ result: 0, msg: err });
          } else {
            res.json({ result: 1, data: docs });
          }
        }
      );
    } else {
      res.json({ result: 0, msg: "Lack of username" });
    }
  });

  app.get("/incomes/type/:type", (req, res) => {
    const type = req.params.type;
    const username = getUsernameFromToken(req.headers.authorization);

    if (!type || !username) {
      res.json({ result: 0, msg: "Lack of data" });
    } else {
      Income.find(
        {
          username,
          type,
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
  app.get("/incomes/date/:date", (req, res) => {
    const date = req.params.date;
    const username = getUsernameFromToken(req.headers.authorization);
    Income.find({ date, username }, (err, docs) => {
      if (err) {
        console.log(`Error: ` + err);
        res.json({ result: 0, msg: "Find data err" });
      } else {
        res.json({ result: 1, data: docs });
      }
    });
  });
  app.get("/incomes/:month/:year", (req, res) => {
    const month =
      req.params.month < 10 ? `0${req.params.month}` : req.params.month;
    const year = req.params.year;
    const username = getUsernameFromToken(req.headers.authorization);
    Income.find(
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

  app.get("/incomes/:year", (req, res) => {
    const year = req.params.year;
    const username = getUsernameFromToken(req.headers.authorization);
    Income.find(
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
  app.get("/wallets", (req, res) => {
    const username = getUsernameFromToken(req.headers.authorization);
    var incomes = [];
    var costs = [];
    var groupIncomes = [];
    var groupCosts = [];
    var nec = 0;
    var play = 0;
    var edu = 0;
    var ffa = 0;
    var ltss = 0;
    var give = 0;
    Income.find({ username }, (err, docs) => {
      if (err) {
        console.log(`Error: ` + err);
      } else {
        groupIncomes = _.groupBy(docs, (income) => income.type);
        Cost.find({ username }, (err, docs) => {
          if (err) {
            console.log(`Error: ` + err);
          } else {
            costs = docs;
            groupCosts = _.groupBy(docs, (cost) => cost.type);
            var income = 0;
            var cost = 0;
            incomes = groupIncomes["NEC"] ?? [];
            costs = groupCosts["NEC"] ?? [];

            income = incomes
              .map((i) => i.income)
              .reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                0
              );

            cost = costs
              .map((c) => c.cost)
              .reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                0
              );

            nec = income - cost;

            incomes = groupIncomes["PLAY"] ?? [];
            costs = groupCosts["PLAY"] ?? [];
            income = incomes
              .map((i) => i.income)
              .reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                0
              );

            cost = costs
              .map((c) => c.cost)
              .reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                0
              );
            play = income - cost;

            incomes = groupIncomes["EDU"] ?? [];
            costs = groupCosts["EDU"] ?? [];
            income = incomes
              .map((i) => i.income)
              .reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                0
              );

            cost = costs
              .map((c) => c.cost)
              .reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                0
              );
            edu = income - cost;

            incomes = groupIncomes["FFA"] ?? [];
            costs = groupCosts["FFA"] ?? [];
            income = incomes
              .map((i) => i.income)
              .reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                0
              );

            cost = costs
              .map((c) => c.cost)
              .reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                0
              );
            ffa = income - cost;

            incomes = groupIncomes["LTSS"] ?? [];
            costs = groupCosts["LTSS"] ?? [];
            income = incomes
              .map((i) => i.income)
              .reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                0
              );

            cost = costs
              .map((c) => c.cost)
              .reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                0
              );
            ltss = income - cost;

            incomes = groupIncomes["GIVE"] ?? [];
            costs = groupCosts["GIVE"] ?? [];
            income = incomes
              .map((i) => i.income)
              .reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                0
              );

            cost = costs
              .map((c) => c.cost)
              .reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                0
              );
            give = income - cost;

            res.json({
              result: 1,
              data: [
                { type: "NEC", total: nec },
                { type: "PLAY", total: play },
                { type: "EDU", total: edu },
                { type: "FFA", total: ffa },
                { type: "LTSS", total: ltss },
                { type: "GIVE", total: give },
              ],
            });
          }
        });
      }
    });
  });
};
