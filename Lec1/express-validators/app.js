const express = require("express");
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");
const NodeCache = require("node-cache");
const fileUpload = require("express-fileupload");

/**
 * პროექტის გაშვება
 * npm install
 * npm start
 *
 * შევადაროთ რაიმე ჩანაწერის დამატებისას (POST) ვალიდაცია, express-validator-ის გამოყენებით და გამოყენების გარეშე
 * რომელი უფრო კითხვადია, ანუ რაზეც ვილაპარაკეთ დეკლარატიული და იმპერატიული სტილი
 */

// ჩავთვალოთ ბაზაა დროებით.
const teamsDb = new NodeCache({ stdTTL: 10 * 60 });
const playersDb = new NodeCache({ stdTTL: 10 * 60 });

const app = express();

// ეს პარსავს http request-ს და req ობიექტში სეტავს req.body ფროფერთის
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());

app.use((req, res, next) => {
  console.log("req.body ", req.body);
  next();
});

/**
 *  teams-ის სია
 *  method: GET
 *  url: localhost:3000/teams/
 */
app.get("/teams", (req, res) => {
  const teams = teamsDb.keys().map((key) => teamsDb.get(key));
  res.json(teams);
});

/**
 * POST რიქვესთი ანუ team-ის დამატება
 * team-ის დამატება express-validator გამოყენებით
 * url: localhost:3000/teams/
 */

app.post(
  "/teams",
  body("name").isString().isLength({ min: 4, max: 30 }),
  body("membersCount").isInt({ min: 4, max: 10 }),
  (req, res) => {
    const errors = validationResult(req); // ეს გვიბრუნებს ერორების ობიექტებს, რომელმა ველებმაც body ვალიდატორი ვერ დააკმაყოფილა

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const id = Math.random() * 10000;
    const name = req.body.name;
    const count = req.body.membersCount;

    console.log(`name = ${name},`, `membersCount = ${count}`);

    teamsDb.set(id, {
      name: name,
      membersCount: count,
    });

    // team წარმატებით შეიქმნა
    res.status(200).json("ok");
  }
);

/**
 *  players-ის სია
 *  method: GET
 *  url: localhost:3000/players/
 */

app.get("/players", (req, res) => {
  const players = playersDb.keys().map((key) => playersDb.get(key));
  res.json(players);
});

/**
 * POST რიქვესთი ანუ team-ის დამატება
 * team-ის დამატება express-validator გამოყენების გარეშე
 * url: localhost:3000/players/
 */
app.post("/players", (req, res) => {
  const errors = [];

  const id = Math.random() * 10000;
  const name = req.body.name || "";
  const count = +req.body.age;

  if (name.length < 4 && name.length > 30) {
    errors.push({
      key: "name",
      error: "invalid length",
    });
  }

  if (+req.body.age < 12 && +req.body.age > 25) {
    errors.push({
      key: "age",
      error: "invalid value",
    });
  }

  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }

  console.log(`name = ${name},`, `membersCount = ${count}`);

  playersDb.set(id, {
    name: name,
    membersCount: count,
  });

  res.status(200).json("ok");
});

app.listen(3000, () => {
  console.log("listening on port", 3000);
});

module.exports = app;
