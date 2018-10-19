const mongoose = require("mongoose");
const app = require("./app");

mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true }
);
const db = mongoose.connection;

db.once("open", () => {
  console.log("Database is connected");
});

db.on("error", error => {
  console.log("An error occurred", error);
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${server.address().port}...`);
});
