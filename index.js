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
// mongoose.connect("mongodb://localhost:27017/happyCow", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   //   useFindAndModify: false,
//   useCreateIndex: true,
// });

app.get("/", (req, res) => {
  res.json("welCome to my happyCow");
});

app.get("/restaurants", (req, res) => {
  try {
    const limit = Number(req.query.limit) || 20;
    const skip = Number(req.query.skip) || 0;
    const { name, type } = req.query;
    let matchesName;
    let matchesType;
    let resType;
    let resName;
    let result = [];

    const onlyKeepType = (eToFilter, eToKeep) => {
      let returnTab = [];
      let eSplitted = eToKeep.split(" "); //in case of more than one type, eToKeep becomes eSplitted

      if (eSplitted.length === 1) {
        return eToFilter.filter((elem) => elem.type === eToKeep);
      }
      if (eSplitted.length > 1) {
        for (let i = 0; i < eSplitted.length; i++) {
          //query
          for (let j = 0; j < eToFilter.length; j++) {
            //data
            if (eToFilter[j].type) {
              let searchType = eToFilter[j].type
                .split(" ")
                .join("-")
                .toLowerCase(); //format existing type in same way

              if (searchType.indexOf(eSplitted[i]) !== -1) {
                //filtering
                matchesType = eToFilter[j]; //collecting filtered objects
                returnTab.push(matchesType); //format as expected on the output
              }
            }
          }
        }
        return returnTab;
      }
    };
    const onlyKeepName = (eToFilter, eToKeep) => {
      let returnTab = [];
      let eSplitted = eToKeep.toString().split(" "); //in case of more than one word in searchBar(query name) in one array
      for (let i = 0; i < eSplitted.length; i++) {
        //query
        matchesName = eToFilter.filter((searchWord) => {
          let rgx = new RegExp(eSplitted[i], "i"); //regex insensitive to case
          if (searchWord.description) {
            return (
              //filtering and collecting on description & name keys
              searchWord.description.match(rgx) + searchWord.name.match(rgx)
            );
          }
        });
      }
      for (let k = 0; k < matchesName.length; k++) {
        returnTab.push(matchesName[k]); //format as expected on the output
      }
      return returnTab;
    };

    if (name || type) {
      if (type) {
        //if user starts with type
        result = onlyKeepType(restaurants, type);

        if (name) { 
          result = onlyKeepName(result, name);
        }
      }

      if (name) {
        //if user starts with name
        result = onlyKeepName(restaurants, name);
        if (type) {
          result = onlyKeepType(result, type);
        }
      }

      
      //SORTING by rating-[NO QUERY]<<<<<<<<<<<--------------------------------------<<<<<<<<<<\\
      result.sort((a, b) => (a.rating < b.rating ? 1 : -1));

      //LIMITTING the OUTPUT<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\\
      const searchResult = result.slice(skip, limit);
      res.status(200).json(searchResult);
    } else {
      //sent by default<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\\
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
