const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");

const bookSchema = Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
  price: Number
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
