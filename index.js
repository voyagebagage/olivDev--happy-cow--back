require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cors = require("cors");

const restaurants = require("./restaurants.json");

const app = express();
app.use(cors());
app.use(formidable());

//////_C.O.N.F.I.G_\\\\\\
mongoose.connect("mongodb://localhost:27017/happyCow", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //   useFindAndModify: false,
  useCreateIndex: true,
});

app.get("/", (req, res) => {
  res.json("welCom to my happyCow");
});

app.get("/restaurants", (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const skip = Number(req.query.skip) || 0;
    const { name, description, type } = req.query;
    let filters;

    if (name || description || type) {
      filters = new RegExp(name || description || type, "i");
      // filters.description = new RegExp(description, "i");
      // filters.type = new RegExp(type, "i");
    }
    // console.log(filters);
    for (let i = 0; i < restaurants.length; i++) {
      const element = restaurants[i].name;
      if (filters.test(element)) {
        console.log(element);
      }

      // element.push(
      //   restaurants[i].match(
      //     filters.name || filters.description || filters.type
      //   )

      // const result = restaurants.filter((restaurant) => restaurant === filters);
      // console.log(result);
    }
    // const result = restaurants.filter((restaurant) => restaurant === filters);
    // console.log(element);
    const searchResult = restaurants.slice(skip, limit);
    // console.log(restaurants);
    // console.log(searchResult);
    res.status(200).json(searchResult);
  } catch (error) {
    console.log(error);
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ error: "None existing route" });
});

app.listen(process.env.PORT || 3500, (req, res) => {
  console.log("Server LAUNCHED");
});
