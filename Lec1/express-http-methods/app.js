const express = require("express");
const { param, body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const Todo = require("./models/todo.model");

const app = express();
/**
 * CRUD example (Create, Read, Update, Delete)
 *
 * Http methods (Post,   Get,  Put,    Delete)
 */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());

const mongoUrl = "mongodb://localhost:27017/todosdb";

mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(() => {
    console.error("Unable to connect to MongoDB");
  });

app.get("/todos", async (req, res) => {
  const todos = await Todo.find({});
  res.json(todos);
});

app.post(
  "/todos/store",

  body("title").exists().notEmpty(),
  body("completed").isBoolean(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    }

    const todo = {
      title: req.body.title,
      completed: req.body.completed,
    };

    console.log(todo);

    const createdTodo = await Todo.create(todo);

    res.status(200).json(createdTodo);
  }
);

app.put(
  "/todos/:id/update",
  param("id").isMongoId(),

  body("title").exists().notEmpty(),
  body("completed").isBoolean(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    }

    const todo = await Todo.findById(req.params.id);

    todo.title = req.body.title;
    todo.completed = req.body.completed;

    const updatedTodo = await todo.save();

    res.status(200).json(updatedTodo);
  }
);

app.delete("/todos/:id/delete", param("id").isMongoId(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  }

  const result = await Todo.findByIdAndDelete(req.params.id);

  res.status(204).json(result);
});

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

module.exports = app;
