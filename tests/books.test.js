// app.test.js
const express = require("express");
const request = require("supertest");

// Initialize MongoDB Memory Server
const MongodbMemoryServer = require("mongodb-memory-server").default;
const mongod = new MongodbMemoryServer();
const mongoose = require("mongoose");
const Author = require("../models/author");
const Book = require("../models/book");

const app = require("../app");

let listOfBooks;

async function addFakeBooks() {
  const author1 = new Author({
    name: "paulo",
    age: 49
  });

  const savedAuthor1 = await author1.save();

  const author2 = new Author({
    name: "john",
    age: 50
  });

  const savedAuthor2 = await author2.save();

  const book1 = new Book({
    title: "book1",
    description: "this is book1",
    author: savedAuthor1._id,
    price: 20
  });

  const savedBook1 = await book1.save();

  const book2 = new Book({
    title: "book2",
    description: "this is book2",
    author: savedAuthor2._id,
    price: 40
  });

  const savedBook2 = await book2.save();

  listOfBooks = { book1: savedBook1, book2: savedBook2 };
}

beforeAll(async () => {
  // Increase timeout to allow MongoDB Memory Server to be donwloaded
  // the first time
  jest.setTimeout(120000);

  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);
});

afterAll(() => {
  mongoose.disconnect();
  mongod.stop();
});

beforeEach(async () => {
  // Clean DB between test runs
  mongoose.connection.db.dropDatabase();

  // Add fake data to the DB to be used in the tests
  await addFakeBooks();
});

test("GET /books should display all books", async () => {
  const response = await request(app).get("/books");
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(2);
});

test("POST /books should create new book", async () => {
  const newBook = new Book({
    title: "new book!",
    description: "this is new book",
    author: listOfBooks.book1.author,
    price: 20
  });

  const response = await request(app)
    .post("/books")
    .send(newBook);

  expect(response.status).toBe(201);

  // Assert based on the fake data added
  expect(response.body).toEqual({
    message: `create new book called new book!`
  });
});

test("PUT /books/:id should update selected books", async () => {
  const requestBody = {
    title: "updated book",
    description: "updated description"
  };

  const response = await request(app)
    .put(`/books/${listOfBooks.book1._id}`)
    .send(requestBody);

  expect(response.status).toBe(200);

  // Assert based on the fake data added
  expect(response.body).toEqual({
    message: `update book with id ${listOfBooks.book1._id}`
  });
});

test("GET /books/:author should find selected books", async () => {
  const response = await request(app).get(`/books/${listOfBooks.book1.author}`);

  expect(response.status).toBe(200);

  // Assert based on the fake data added
  expect(response.body.length).toEqual(1);
  expect(response.body[0].title).toEqual(listOfBooks.book1.title);
});

test("DELETE /books/:id should delete selected book", async () => {
  const response = await request(app).delete(`/books/${listOfBooks.book1._id}`);

  expect(response.status).toBe(200);

  // Assert based on the fake data added
  expect(response.body).toEqual({
    message: `delete book with id ${listOfBooks.book1._id}`
  });
});
