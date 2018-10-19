const express = require("express");
const router = express.Router();
const Book = require("../models/book");

/* GET books listing. */
router.get("/", async (req, res, next) => {
  try {
    const result = await Book.find().populate("author");
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// router.get("/:id", async (req, res, next) => {
//   try {
//     const result = await Book.find({ _id: req.params.id }).populate("author");
//     res.json(result);
//   } catch (err) {
//     next(err);
//   }
// });

router.get("/:author", async (req, res, next) => {
  try {
    const result = await Book.find({ author: req.params.author });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res
      .status(201)
      .json({ message: `create new book called ${req.body.title}` });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const updatedBook = await Book.findOneAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json({ message: `update book with id ${req.params.id}` });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const result = await Book.findByIdAndDelete(req.params.id);
    res.json({ message: `delete book with id ${req.params.id}` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
