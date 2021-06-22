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
    let filters;
    let filterType;
    let matchesName;
    let matchesType;
    let returnTab = [];
    const result = [];

    const onlyKeepType = (eToFilter, eToKeep) => {
      let eSplitted = eToKeep.split(" ");
      if (eSplitted.length === 1) {
        return eToFilter.filter((elem) => elem.type === eToKeep);
      }
      if (eSplitted.length > 1) {
        for (let i = 0; i <= eSplitted.length - 1; i++) {
          for (let j = 0; j <= eToFilter.length - 1; j++) {
            if (eToFilter[j].type) {
              let searchType = eToFilter[j].type
                .split(" ")
                .join("-")
                .toLowerCase();

              if (searchType.indexOf(eSplitted[i]) !== -1) {
                matchesType = eToFilter[j];
                returnTab.push(matchesType);
                console.log("matchesType-------------------", matchesType.name);
                console.log("matchesType-------------------", matchesType.type);
                console.log("matchesType--legnth--", matchesType.length);
                // result.push(matchesType);
              }
            }
          }
        }
        return returnTab;
      }
    };
    // const onlyKeepName = (eToFilter, eToRemove) => {
    //   return eToFilter.filter((elem) => {
    //     return (elem.name === eToRemove + elem.description) === eToRemove;
    //   });
    // };

    if (name || type) {
      if (type) {
        filterType = type.split(" ");
        // for (let i = 0; i < filterType.length; i++) {
        console.log(filterType.length);
        for (let i = 0; i < filterType.length; i++) {
          for (let j = 0; j < restaurants.length; j++) {
            if (restaurants[j].type) {
              let searchType = restaurants[j].type
                .split(" ")
                .join("-")
                .toLowerCase();
              // console.log("SF   ", searchType);
              if (searchType.indexOf(filterType[i]) !== -1) {
                matchesType = restaurants[j];
                result.push(matchesType);
                // console.log("length", result.length);
                // console.log("-J_", j);
                // // console.log("LENGTH", matchesType.length);
                // console.log("---------------------", matchesType.name);
                // console.log("---------------------", matchesType.type);
                // console.log("------------|-------/---");
              }
            }
          }
          // matchesType = restaurants.filter((searchType) => {
          //   // let rgx = ;
          //   console.log("f  ", filterType);
          //   let rgx = new RegExp(filterType[i], "i");
          //   console.log(
          //     "SF   ",
          //     searchType.type.split(" ").join("-").toLowerCase()
          //   );
          //   // console.log(" -------------");
          //   // if (searchType.type) {
          //   return (
          //     searchType.type
          //       // .toString()
          //       .split(" ")
          //       .join("-")
          //       .toLowerCase()
          //       .indexOf(filterType !== -1)
          //   );
          // });
        }
        // for (let m = 0; m < fil.length; m++) {
        //   const element = fil[m];
        // }
        // let res = takeOffNameDescription(matchesType, filters);
        // for (let k = 0; k < res.length; k++) {
        //   console.log(k);
        //   console.log(res[k].name);
        //   console.log(" -------------");
        //   console.log("|              |");
        //   console.log(" -------------");
        //   console.log(res[k].type);
        //   console.log(" -------------");
        //   console.log("|              |");
        // }
        for (let l = 0; l < matchesType.length; l++) {
          console.log(l);

          console.log(matchesType[l].type);
          console.log("xxxxxxxxxxxxxx");
          console.log("|              |");
          console.log(" xxxxxxxxxxxxx");
        }
        // console.log(matchesType);
        //<<<<<--------------------------------<<<<XXXX---| |---XXXX>>>>>>>>>>>>>\\
      }
      //FILTERING SEARCH ON name, description KEYs  <<<<<<<<<XXXX---| |---XXXX>>>>>>>>>>>\\
      if (name) {
        filters = name.toString().split(" "); //getting all the words of the search(query name) in one array
        for (let i = 0; i < filters.length; i++) {
          matchesName = restaurants.filter((searchWord) => {
            let rgx = new RegExp(filters[i], "i"); //regex insensitive to case of one by one words in the search bar
            if (searchWord.description) {
              return (
                searchWord.description.match(rgx) + searchWord.name.match(rgx)
              );
            }
          });
        }
        // console.log(result);
        if (type) {
          let res = onlyKeepType(matchesName, type);
          console.log("RES", res);
          console.log("RES", res.length);
          result.push(res);
          for (let k = 0; k < res.length; k++) {
            console.log(k);
            console.log(res[k].name);
            console.log(" -------------");
            console.log("|              |");
            console.log(" -------------");
            console.log(res[k].type);
            console.log(" -------------");
            console.log("|              |");
            console.log(" -------------");
          }
        }
        console.log(
          " ------________---XXXXXXXXX-----****************************************************----"
        );

        for (let k = 0; k < matchesName.length; k++) {
          console.log("-K-", k);
          result.push(matchesName[k]);

          console.log("LENGTH NAME", matchesName.length);
          console.log(matchesName[k].name);
          console.log(" xxxxxxxxxxxxx");
          console.log("|              |");
          console.log(" -------------");
          console.log(matchesName[k].type);
          console.log(" -------------");
          console.log("|              |");
          console.log(" xxxxxxxxxxxxx");
          console.log(matchesName[k].description);
          console.log(" -------------");
          console.log("|              |");
          console.log(" xxxxxxxxxxxxx");
        }
        console.log(
          "---------------------------------------",
          typeof matchesName
        );
        // result.push(matchesName);
        // let matches = data.filter((title) => {
        //   const regex = new RegExp(`^${term}`, "gi");
        //   return regex.test(title.title);
        // });
        // for (let i = 0; i < restaurants.length; i++) {
        //   let result1;
        //   let result2;
        //   let tempElem = [];
        //   //TARGETING description Key<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\\
        //   // if (restaurants[i].description) {
        //   //   tempElem.push(restaurants[i].description.split(" "));
        //   //   for (let k = 0; k < tempElem.length; k++) {
        //   //     const elementDescr = tempElem[k];
        //   //     //TESTING description Key WORDS one by one<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\\
        //   //     if (filters.test(elementDescr)) {
        //   //       //IF Match<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\\
        //   //       if (restaurants[i].name) {
        //   //         result1 = restaurants[i];
        //   //       }
        //   //       //because one enough-<<<<<<<<<<<<<<<<<<<<<<<<<\\
        //   //       break;
        //   //     }
        //   //   }
        //   // }
        //   const element1 = restaurants[i].name;
        //   const element3 = restaurants[i].type;
        //   //TARGETING name & type Key<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\\
        //   // if (filters.test(element1) || filters.test(element3)) {
        //   //   if (restaurants[i].name) {
        //   //     result2 = restaurants[i];
        //   //   }
        //   // }

        //   //COLLECTING in one ARRAY<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\\
        //   // if (result1 || result2) {
        //   //   if (result1 === result2) {
        //   //     result.push(result1 || result2);
        //   //   } else if (result1) {
        //   //     result.push(result1);
        //   //   } else if (result2) {
        //   //     result.push(result2);
        //   //   }
        //   // }
        // }
        // }
        // if (name && type) {
        //   let tempType;
        //   let strType = new RegExp(type, "i");
        //   // strType.toString().split(" ");

        //   for (let l = 0; l < restaurants.length; l++) {
        //     tempType = restaurants[l].type;
        //     if (strType.test(tempType)) {
        //       if (restaurants[l].type) {
        //         tempType = restaurants[l];
        //         result.push(tempType);
        //       }
        //     }
        //   }
        //   filters = new RegExp(name, "i");
        //   filters.toString().split(" ");

        //   for (let i = 0; i < restaurants.length; i++) {
        //     let result1;
        //     let result2;
        //     let tempElem = [];
        //     //TARGETING description Key<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\\
        //     if (restaurants[i].description) {
        //       tempElem.push(restaurants[i].description.split(" "));
        //       for (let k = 0; k < tempElem.length; k++) {
        //         const elementDescr = tempElem[k];
        //         //TESTING description Key WORDS one by one<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\\
        //         if (filters.test(elementDescr)) {
        //           //IF Match<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\\
        //           if (restaurants[i].name) {
        //             result1 = restaurants[i];
        //           }
        //           //because one enough-<<<<<<<<<<<<<<<<<<<<<<<<<\\
        //           break;
        //         }
        //       }
        //     }
        //     const element1 = restaurants[i].name;
        //     const element3 = restaurants[i].type;
        //     //TARGETING name & type Key<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\\
        //     if (filters.test(element1) || filters.test(element3)) {
        //       if (restaurants[i].name) {
        //         result2 = restaurants[i];
        //       }
        //     }

        //     //COLLECTING in one ARRAY<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\\
        //     if (result1 || result2) {
        //       if (result1 === result2) {
        //         result.push(result1 || result2);
        //       } else if (result1) {
        //         result.push(result1);
        //       } else if (result2) {
        //         result.push(result2);
        //       }
        //     }
        //   }
        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\\

        //REOMVING None TYPE query from SEARCH_-<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\\

        // for (let l = 0; l < result.length; l++) {
        //   console.log("tout------------- ", result[l].type);

        //   if (result[l].type !== strType && result[l].type !== filters) {
        //     console.log("BEF----------", result[l].type);

        //     result.pop();
        //     for (let j = 0; j < result.length; j++) {
        //       //<-----for testing-------------->
        //       console.log("---------------------", result[j].type);
        //       // console.log(delTab[j].type);
        //       // console.log(result[j].rating);
        //     }
        //   }
        // }
      }
      //SORTING by rating-[NO QUERY]<<<<<<<<<<<--------------------------------------<<<<<<<<<<\\
      result.sort((a, b) => (a.rating < b.rating ? 1 : -1));

      for (let j = 0; j < result.length; j++) {
        //<-----for testing-------------->
        // console.log("xxxxxxxxxx------XXXXX", result[j].type);
        // console.log(delTab[j].type);
        // console.log(result[j].rating);
      }
      console.log("RESULT LENGTH", result.length);
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
