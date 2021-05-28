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

    //IF query then without case, we split in case of many words<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\\
    if (name || description || type) {
      filters = new RegExp(name || description || type, "i");

      filters.toString().split(" ");

      for (let i = 0; i < restaurants.length; i++) {
        let result1;
        let result2;
        let tempElem = [];
        //TARGETING description Key<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\\
        if (restaurants[i].description) {
          tempElem.push(restaurants[i].description.split(" "));
          for (let k = 0; k < tempElem.length; k++) {
            const elementDescr = tempElem[k];
            //TESTING description Key WORDS one by one<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\\
            if (filters.test(elementDescr)) {
              //IF Match<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\\
              if (restaurants[i].name) {
                result1 = restaurants[i];
              }
              break;
            }
          }
        }
        const element1 = restaurants[i].name;
        const element3 = restaurants[i].type;
        //TARGETING name & type Key<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\\
        if (filters.test(element1) || filters.test(element3)) {
          if (restaurants[i].name) {
            result2 = restaurants[i];
          }
        }
        //COLLECTING in one ARRAY<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\\
        if (result1 || result2) {
          if (result1 === result2) {
            result.push(result1 || result2);
          } else if (result1) {
            result.push(result1);
          } else if (result2) {
            result.push(result2);
          }
        }
      }
      //SORTING by rating-[NO QUERY]<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\\
      result.sort((a, b) => (a.rating < b.rating ? 1 : -1));
      // for (let j = 0; j < result.length; j++) {
      //   console.log(result[j].rating);
      // }
      //LIMITTING the OUTPUT<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\\
      const searchResult = result.slice(skip, limit);
      res.status(200).json(searchResult);
    } else {
      //sent by default<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\\
      const homeScreenResult = restaurants.slice(skip, limit);

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
