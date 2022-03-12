// Imports
const axios = require("axios");
const stringSimilarity = require("string-similarity");
require("dotenv").config();
const fs = require("fs");

module.exports = {
  ryte: async (sentence) => {
    try {
      const { data } = await axios({
        method: "post",
        url: "https://api.rytr.me/v1/ryte",
        headers: {
          Authentication: `Bearer ${process.env.RYTR_API_KEY_4}`,
          "Content-Type": "application/json",
        },
        data: {
          languageId: process.env.LANGUAGE_ID,
          toneId: process.env.TONE_ID,
          useCaseId: process.env.REWORD_USE_CASE_ID,
          inputContexts: { [process.env.USE_CASE_KEY_LABEL]: sentence },
          variations: 1,
          userId: "USER1",
          format: "text",
          creativityLevel: "max",
        },
      });

      return data.success ? data.data : null;
    } catch (error) {
      console.log(`original sentence---------${sentence}\n`, error);
    }

    return null;
  },
  loopRyteUntilFound: async (sentence) => {
    // get 1 variation back from reword text
    let similarity = 1;
    let newText;
    let loopCount = 0;
    let characterCount = 0;
    let rewordedDype;
    // loop until the sentence similarity is in the range of 0.6 - 0.7
    do {
      rewordedDype = await module.exports.ryte(sentence);
      if (rewordedDype != undefined) {
        similarity = stringSimilarity.compareTwoStrings(
          sentence,
          rewordedDype[0].text
        );
        loopCount++;
        characterCount += rewordedDype[0].text.length;
      }
    } while (similarity > 0.7 || similarity < 0.6);
    console.log("loopCount: ", loopCount);
    console.log("characterCount: ", characterCount);
    console.log("3 rewordedDype: ", rewordedDype);
    return rewordedDype[0].text;
  },
  recursiveRyte: async (original, generated) => {
    // setTimeout(async () => {
    try {
      let similarity = stringSimilarity.compareTwoStrings(original, generated);

      let lessThanChars = original.length < 65;
      let maxThreshold = lessThanChars ? 0.85 : 0.72;
      let minThreshold = lessThanChars ? 0.65 : 0.58;
      if (similarity > maxThreshold || similarity < minThreshold) {
        let res = await axios({
          method: "post",
          url: "https://api.rytr.me/v1/ryte",
          headers: {
            Authentication: `Bearer ${process.env.RYTR_API_KEY_4}`,
            "Content-Type": "application/json",
          },
          data: {
            languageId: process.env.LANGUAGE_ID,
            toneId: process.env.TONE_ID,
            useCaseId: process.env.REWORD_USE_CASE_ID,
            inputContexts: { [process.env.USE_CASE_KEY_LABEL]: original },
            variations: 1,
            userId: "USER1",
            format: "text",
            creativityLevel: "max",
          },
        });
        console.log("original sentence------\n", original);
        console.log("response data------\n", res.data);
        if (res.data.success)
          fs.appendFile(
            "characterCount.txt",
            `${res.data.data[0].text.length.toString()}\n`,
            (e) => console.log(e)
          );
        return res.data.success
          ? module.exports.recursiveRyte(original, res.data.data[0].text)
          : module.exports.recursiveRyte(original, generated);
      } else return generated;
    } catch (err) {
      console.log("Error: ", err);
    }
    // }, 500);
  },
  // recursiveRyte: async (original, generated, i) => {
  //   try {
  //     // let similarity = stringSimilarity.compareTwoStrings(original, generated);
  //     let similarity = Math.random();
  //     // console.log(similarity);
  //     if (similarity > 0.7 || similarity < 0.2) {
  //       let API_KEY =
  //         API_KEY_LIST[Math.floor(Math.random() * API_KEY_LIST.length)];

  //       let res = await axios({
  //         method: "get",
  //         url: "https://dog.ceo/api/breeds/image/random",
  //         headers: {
  //           Authentication: `Bearer ${API_KEY}`,
  //           "Content-Type": "application/json",
  //         },
  //         // data: {
  //         //   languageId: process.env.LANGUAGE_ID,
  //         //   toneId: process.env.TONE_ID,
  //         //   useCaseId: process.env.REWORD_USE_CASE_ID,
  //         //   inputContexts: { [process.env.USE_CASE_KEY_LABEL]: original },
  //         //   variations: 1,
  //         //   userId: "USER1",
  //         //   format: "text",
  //         //   creativityLevel: "max",
  //         // },
  //       });
  //       return res.data.status
  //         ? module.exports.recursiveRyte(original, res.data.message, i)
  //         : module.exports.recursiveRyte(original, generated, i);
  //     } else {
  //       return generated;
  //     }
  //   } catch (err) {
  //     console.log("Error: ");
  //   }
  // },
};

// // Imports
// const axios = require("axios");
// const stringSimilarity = require("string-similarity");
// require("dotenv").config();
// const API_KEY_LIST = [
//   process.env.RYTR_API_KEY_0,
//   process.env.RYTR_API_KEY_1,
//   process.env.RYTR_API_KEY_2,
//   process.env.RYTR_API_KEY_3,
//   process.env.RYTR_API_KEY_4,
//   process.env.RYTR_API_KEY_5,
//   process.env.RYTR_API_KEY_6,
//   process.env.RYTR_API_KEY_7,
//   process.env.RYTR_API_KEY_8,
// ];

// module.exports = {
//   ryte: async (sentence) => {
//     setTimeout(async () => {
//       try {
//         let API_KEY =
//           API_KEY_LIST[Math.floor(Math.random() * API_KEY_LIST.length)];

//         const { data } = await axios({
//           method: "post",
//           url: "https://api.rytr.me/v1/ryte",
//           headers: {
//             Authentication: `Bearer ${API_KEY}`,
//             "Content-Type": "application/json",
//           },
//           data: {
//             languageId: process.env.LANGUAGE_ID,
//             toneId: process.env.TONE_ID,
//             useCaseId: process.env.REWORD_USE_CASE_ID,
//             inputContexts: { [process.env.USE_CASE_KEY_LABEL]: sentence },
//             variations: 1,
//             userId: "USER1",
//             format: "text",
//             creativityLevel: "max",
//           },
//         });

//         return data.success ? data.data : null;
//       } catch (error) {
//         console.log(error);
//       }

//       return null;
//     }, 500);
//   },
//   loopRyteUntilFound: async (sentence) => {
//     // get 1 variation back from reword text
//     let similarity = 1;
//     let newText;
//     let loopCount = 0;
//     let characterCount = 0;
//     let rewordedDype;
//     // loop until the sentence similarity is in the range of 0.6 - 0.7
//     do {
//       rewordedDype = await module.exports.ryte(sentence);
//       if (rewordedDype != undefined) {
//         similarity = stringSimilarity.compareTwoStrings(
//           sentence,
//           rewordedDype[0].text
//         );
//         loopCount++;
//         characterCount += rewordedDype[0].text.length;
//       }
//     } while (similarity > 0.7 || similarity < 0.6);
//     console.log("loopCount: ", loopCount);
//     console.log("characterCount: ", characterCount);
//     console.log("3 rewordedDype: ", rewordedDype);
//     return rewordedDype[0].text;
//   },
//   recursiveRyte: async (original, generated) => {
//     setTimeout(async () => {
//       try {
//         let similarity = stringSimilarity.compareTwoStrings(
//           original,
//           generated
//         );

//         if (similarity > 0.7 || similarity < 0.6) {
//           let API_KEY =
//             API_KEY_LIST[Math.floor(Math.random() * API_KEY_LIST.length)];

//           let { data } = await axios({
//             method: "post",
//             url: "https://api.rytr.me/v1/ryte",
//             headers: {
//               Authentication: `Bearer ${process.env.RYTR_API_KEY_4}`,
//               "Content-Type": "application/json",
//             },
//             data: {
//               languageId: process.env.LANGUAGE_ID,
//               toneId: process.env.TONE_ID,
//               useCaseId: process.env.REWORD_USE_CASE_ID,
//               inputContexts: { [process.env.USE_CASE_KEY_LABEL]: original },
//               variations: 1,
//               userId: "USER1",
//               format: "text",
//               creativityLevel: "max",
//             },
//           });
//           console.log("original sentence------\n", original);
//           console.log("response data------\n", data);
//           return data.success
//             ? module.exports.recursiveRyte(original, data.data[0].text)
//             : module.exports.recursiveRyte(original, generated);
//         } else return generated;
//       } catch (err) {
//         console.log("Error: ", err);
//       }
//     }, 500);
//   },
// };
