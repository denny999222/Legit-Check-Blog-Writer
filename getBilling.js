const axios = require("axios");
require("dotenv").config();
const fs = require("fs");

const API_KEY_LIST = [
  process.env.RYTR_API_KEY_0,
  process.env.RYTR_API_KEY_1,
  process.env.RYTR_API_KEY_2,
  process.env.RYTR_API_KEY_3,
  process.env.RYTR_API_KEY_4,
  process.env.RYTR_API_KEY_5,
  process.env.RYTR_API_KEY_6,
  process.env.RYTR_API_KEY_7,
  process.env.RYTR_API_KEY_8,
];

(async () => {
  axios
    .get(`https://api.rytr.me/v1/usage`, {
      headers: {
        Authentication: `Bearer ${API_KEY_LIST[9]}`,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      let count = 0;
      res.data.data.forEach((item) => {
        count += item.units;
      });
      console.log(`${(count / 10000) * 0.7} USD`);
    });
})();

// URLS.URLS.forEach(async (key) => {
// let billing = await axios.get(
//   `https://api.rytr.me/v1/usage`,
//   {},
//   {
//     headers: {
//       Authentication: `Bearer ${API_KEY_LIST[4]}`,
//       "Content-Type": "application/json",
//     },
//   }
// );
// console.log(Object.keys(billing));
// });
