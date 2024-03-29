const { model, Schema } = require("mongoose");

const todoSchema = new Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, required: true },
});

module.exports = model("todos", todoSchema);
