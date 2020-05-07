const express = require("express");
const { param, body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const Person = require("./models/Person.model");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());

const mongoUrl = "mongodb://localhost:27017/Persondb";

mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(() => {
    console.error("Unable to connect to MongoDB");
  });

app.get("/persons", async (req, res) => {
  const persons = await Person.find({});
  res.json(persons);
});

app.post(
  "/persons/store",

    
  body("firstName").exists().notEmpty(),
  body("lastName").exists().notEmpty(),
  body("age").exists().isInt(),
  body("height").exists().isInt(),


  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    }

    const person = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      height: req.body.height,

    };

    console.log(person);

    const createdPerson = await Person.create(person);

    res.status(200).json(createdPerson);
  }
);

app.put(
  "/persons/:id/update",
  param("id").isMongoId(),

  
  body("firstName").exists().notEmpty(),
  body("lastName").exists().notEmpty(),
  body("age").exists().isInt(),
  body("height").exists().isInt(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    }

    const currPerson = await Person.findById(req.params.id);

    currPerson.firstName = req.body.firstName;
    currPerson.lastName = req.body.lastName;
    currPerson.age = req.body.age;
    currPerson.height = req.body.height;

    const updatedPerson = await currPerson.save();

    res.status(200).json(updatedPerson);
  }
);

app.delete("/persons/:id/delete", param("id").isMongoId(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  }

  const result = await Person.findByIdAndDelete(req.params.id);

  res.status(204).json(result);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

module.exports = app;
