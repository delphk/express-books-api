// app.test.js
const express = require("express");
const request = require("supertest");

// Initialize MongoDB Memory Server
const MongodbMemoryServer = require("mongodb-memory-server").default;
const mongod = new MongodbMemoryServer();
const mongoose = require("mongoose");
const Author = require("../models/author");

const app = require("../app");

async function addFakeAuthors() {
  const author1 = new Author({
    name: "paulo",
    age: 49
  });

  await author1.save();

  const author2 = new Author({
    name: "john",
    age: 50
  });

  await author2.save();
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
  await addFakeAuthors();
});

test("GET /authors should display all authors", async () => {
  const response = await request(app).get("/authors");

  expect(response.status).toBe(200);

  // Assert based on the fake data added
  expect(response.body.length).toBe(2);
});

test("POST /authors should create new author", async () => {
  const newAuthor = new Author({
    name: "author3",
    age: 30
  });

  const response = await request(app)
    .post("/authors")
    .send(newAuthor);

  expect(response.status).toBe(201);

  // Assert based on the fake data added
  expect(response.body).toEqual({
    message: "create new author called author3"
  });
});

test("PUT /authors/:name should update selected author", async () => {
  const requestBody = {
    name: "jim",
    age: "33"
  };

  const response = await request(app)
    .put("/authors/paulo")
    .send(requestBody);

  expect(response.status).toBe(200);

  // Assert based on the fake data added
  expect(response.body).toEqual({ message: "updated author with name paulo" });
});

test("GET /authors/:id should display all books by author", async () => {
  const createAuthor = new Author({
    name: "jim",
    age: 60
  });
  const newAuthor = await createAuthor.save();

  const response = await request(app).get(`/authors/${newAuthor._id}`);

  expect(response.status).toBe(200);

  // Assert based on the fake data added
  expect(response.body.name).toEqual("jim");
  expect(response.body.age).toEqual(60);
});

test("DELETE /authors/:id should display all books by author", async () => {
  const createAuthor = new Author({
    name: "jim",
    age: 60
  });
  const newAuthor = await createAuthor.save();

  const response = await request(app).delete(`/authors/${newAuthor._id}`);

  expect(response.status).toBe(200);

  // Assert based on the fake data added
  expect(response.body).toEqual({
    message: `deleted author with id ${newAuthor._id}`
  });
});
