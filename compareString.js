const stringSimilarity = require("string-similarity");

let legitcheckapp =
  "The medial text is pretty much the best way to tell the fake Off-White 2s – along with the size tag.";

let dype =
  "Medial text is one of the best ways to tell a fake off-white 2 – as well as the size tag.";

console.log(stringSimilarity.compareTwoStrings(legitcheckapp, dype));
