const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");

router.get("/", async (req, res, next) => {
  const results = await Author.find();
  res.json(results);
});

router.get("/:id", async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({ author: req.params.id });
    res.json({ ...author.toJSON(), books: books });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newAuthor = new Author(req.body);
    await newAuthor.save();
    res
      .status(201)
      .json({ message: `create new author called ${req.body.name}` });
  } catch (err) {
    next(err);
  }
});

router.put("/:name", async (req, res, next) => {
  try {
    await Author.findOneAndUpdate(req.params.name, req.body, { new: true });
    res.json({ message: `updated author with name ${req.params.name}` });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const updatedAuthor = await Author.findOneAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ message: `deleted author with id ${req.params.id}` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
