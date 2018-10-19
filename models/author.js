const mongoose = require("mongoose");
const { Schema } = mongoose;

const authorSchema = Schema({
  name: String,
  age: Number
});

const Author = mongoose.model("Author", authorSchema);
module.exports = Author;
