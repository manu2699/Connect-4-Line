const express = require("express");
const Datastore = require("nedb");

const app = express();
app.use(express.json());

const db = new Datastore("game.db");
db.loadDatabase();
app.set("db", db);

const port = process.env.PORT || 5000;

const GameRoutes = require("./routes/index");
app.use("/api/", GameRoutes);

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
