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
    const result = [];

    if (name || description || type) {
      filters = new RegExp(name || description || type, "i");

      for (let i = 0; i < restaurants.length; i++) {
        let result1;
        let result2;
        let tempElem = [];
        if (restaurants[i].description) {
          tempElem.push(restaurants[i].description.split(" "));
          // console.log("tempELM===>>>" + tempElem);
          for (let k = 0; k < tempElem.length; k++) {
            const elementDescr = tempElem[k];
            if (filters.test(elementDescr)) {
              // console.log("elementDescr---------------------------");
              // if (restaurants[i].name !== restaurants[i - 1].name) {
              if (restaurants[i].name) {
                result1 = restaurants[i];
              }

              // console.log("result DESC ===>" + restaurants[i].name);
              break;
              // }
            }
          }
        }
        const element1 = restaurants[i].name;
        const element3 = restaurants[i].type;
        if (filters.test(element1) || filters.test(element3)) {
          if (restaurants[i].name) {
            result2 = restaurants[i];
          }
          // console.log(
          //   "result NAME & TYPE ================================>" +
          //     restaurants[i].name
          // );
        }
        if (result1 || result2) {
          if (result1 === result2) {
            result.push(result1 || result2);
            // console.log("result " + result);
          } else if (result1) {
            // console.log("result11111" + result1);
            result.push(result1);
          } else if (result2) {
            // console.log("result22222" + result2);
            result.push(result2);
          }
        }
      }
      const searchResult = result.slice(skip, limit);
      console.log(searchResult);
      res.status(200).json(searchResult);
    } else {
      const homeScreenResult = restaurants.slice(skip, limit);
      // console.log(restaurants);
      // console.log(searchResult);
      res.status(200).json(homeScreenResult);
    }
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
