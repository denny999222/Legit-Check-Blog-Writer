// Imports
const axios = require("axios");
require("dotenv").config();
const Ryte = require("./ryte.js");

const fs = require("fs");
const stringSimilarity = require("string-similarity");

const URLS = require("./urls");

// (async () => {
//   let legitcheckapp =
//     "The “VW1” text stands for the factory assigned to manufacture the authentic Air Jordan 4 University Blue sneakers.";

//   // get 3 variations back from expanding text
//   let rewordedDype = await ryteReword(legitcheckapp);

//   let getSimilarity = await rewordedDype.map(async (r, i) => {
//     return {
//       ...r,
//       similarity: stringSimilarity.compareTwoStrings(legitcheckapp, r.text),
//     };
//   });

//   let sortedSimilarity = [];
//   Promise.all(getSimilarity).then(async (res) => {
//     sortedSimilarity = res;
//     sortedSimilarity.sort((a, b) => a.similarity - b.similarity);
//     console.log("sorted Similarity--\n", sortedSimilarity);

//     let rewordDypeAgain = await ryteReword(sortedSimilarity[0].text);
//     let getSimilarityAgain = await rewordDypeAgain.map(async (r, i) => {
//       return {
//         ...r,
//         similarity: stringSimilarity.compareTwoStrings(legitcheckapp, r.text),
//       };
//     });

//     Promise.all(getSimilarityAgain).then(async (_res) => {
//       sortedSimilarityAgain = _res;
//       sortedSimilarityAgain.sort((a, b) => a.similarity - b.similarity);
//       console.log("sorted Similarity AGAIN--\n", sortedSimilarityAgain);
//     });
//   });
// })();

// continues to loop until the difference is less than .7
// (async () => {
//   let legitcheckapp =
//     "Below the triangle-shaped cages, you are going to find those rectangle-shaped stitches on all profile sides of the UNC 4s.";

//   // get 1 variation back from reword text
//   let similarity = 1;
//   let newText = {};
//   do {
//     let rewordedDype = await ryteReword(legitcheckapp);
//     if (rewordedDype != undefined) {
//       similarity = stringSimilarity.compareTwoStrings(
//         legitcheckapp,
//         rewordedDype[0].text
//       );
//       newText = { ...rewordedDype, similarity };
//       console.log("inside loop", newText);
//     }
//   } while (similarity > 0.7 || similarity < 0.6);
//   console.log("outside loop", newText);
// })();

(async () => {
  // console.log("before");
  // let sentence =
  //   "Speaking about the real Off-White 2s, it is noticeable how the stitches all around the Air Jordan logo are thinner and longer than the fake shoes, therefore having more of an “airy” look compared to the fake pair’s stitching.";
  // let newText = await Ryte.recursiveRyte(sentence, sentence);

  // // let newText = await Ryte.ryte(sentence);

  // console.log("newText---", newText);
  fs.appendFile("characterCount.txt", `${(20).toString()}\n`, (e) =>
    console.log(e)
  );
})();
