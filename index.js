const Ryte = require("./ryte.js");
const Scraper = require("./scrape-guides.js");
const Contentful = require("./contentful");
const Helper = require("./helper");
const fs = require("fs");
const URLS = require("./urls");

const automateOneUrl = async (url) => {
  let data = await Scraper.scrape(url);

  let leftOffText = "";

  // removes intro text
  let isAfterIntroIndex = 0;
  for (let i = 0; i < data.body.length; i++) {
    // DO THIS IF THE SCRIPT STOPS (to avoid wasting api calls)
    // if (data.body[i] && data.body[i].value == leftOffText) {
    //   isAfterIntroIndex = i;
    //   break;
    // }
    if (data.body[i] && data.body[i].type == "heading-3") {
      isAfterIntroIndex = i;
      break;
    }
  }

  // count the amount of steps (h3 tags) there are
  let h3Count = 0;
  let cutOffIndex = 0;
  for (let i = 0; i < data.body.length; i++) {
    if (data.body[i] && data.body[i].type == "heading-3") {
      h3Count++;
    }
  }

  // limit only up to 8 steps MAX of the lc guide
  let h3Count2 = 0;
  if (h3Count > 8) {
    for (let i = 0; i < data.body.length; i++) {
      if (data.body[i] && data.body[i].type == "heading-3") {
        h3Count2++;
      }
      if (h3Count2 == 9) {
        cutOffIndex = i;
        break;
      }
    }
  } else cutOffIndex = data.body.length;

  // filters the undefined (item, item.type, item.value)
  let newData = data.body
    .slice(isAfterIntroIndex, cutOffIndex)
    .filter((item) => {
      let itemUndefined = item != undefined;
      let typeUndefined = item.type != undefined;
      let valueUndefined = item.value != undefined;
      return itemUndefined && typeUndefined && valueUndefined;
    });

  let requestBuffer = [];
  let promiseIndex = 0;
  let handledPromises = [];
  for (let i = 0; i < newData.length; i++) {
    for (let j = 0; j < 2; j++) {
      if (newData[promiseIndex] == undefined) break;
      if (
        newData[promiseIndex].type == "heading-3" ||
        newData[promiseIndex].type == "embedded-asset-block" ||
        newData[promiseIndex].type == "heading-4"
      ) {
        requestBuffer.push(newData[promiseIndex]);
      } else if (newData[promiseIndex].type == "paragraph") {
        requestBuffer.push({
          type: newData[promiseIndex].type,
          value: await Ryte.recursiveRyte(
            newData[promiseIndex].value,
            newData[promiseIndex].value
          ),
        });
      }
      promiseIndex++;
    }

    if (requestBuffer.length != 0) {
      await Promise.all(requestBuffer).then((fourPromise) => {
        fs.appendFile(
          "generatedText.txt",
          `${JSON.stringify(fourPromise)}`,
          (e) => console.log(e)
        );
        handledPromises.push(...fourPromise);
      });
      requestBuffer.splice(0, requestBuffer.length);
    }
  }

  let fields = {
    ...data,
    body: { "en-US": Helper.formatBody(handledPromises) },
  };
  Contentful.addGuide(fields);
};

(async () => {
  let _requestBuffer = [];
  let _promiseIndex = 0;
  let _handledPromises = [];
  for (let k = 0; k < URLS.URLS.length; k++) {
    console.log(`STARTED:\n${URLS.URLS[k]}`);
    for (let l = 0; l < 1; l++) {
      _requestBuffer.push(await automateOneUrl(URLS.URLS[_promiseIndex]));
      _promiseIndex++;
    }

    await Promise.all(_requestBuffer).then((onePromise) => {
      _handledPromises.push(...onePromise);
    });
    _requestBuffer.splice(0, _requestBuffer.length);
  }
})();
