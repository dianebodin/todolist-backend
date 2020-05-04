const mongoose = require("mongoose");

const Task = mongoose.model("Task", {
  title: {
    type: String,
    minlength: 1,
    maxlength: 30,
  },
  done: {
    type: Boolean
  },
});

module.exports = Task;