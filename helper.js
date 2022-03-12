const uuid62 = require("uuid62");

module.exports = {
  trimHeader: async (content) => {
    let text = content.toLowerCase();
    // if header3 or header 4
    // remove all numbers (1,2,3...) from string
    text = text.replace(/[0-9]/g, "");
    // remove all punctuation from a string
    text = text.replace(/[.,\/#!$%\^&\*;{}=\-_`~()]/g, "");
    // remove the "step 1:" text
    text = text.includes(":") ? text.split(":")[1] : text;
    //   replace keywords fake, real, vs with empty
    text = text.replace(/fake|real|vs/g, "");

    text = text.trim();

    // remove all "on", "of", "your", and "the" at end of string
    let onIndex = text.lastIndexOf(" on");
    let ofIndex = text.lastIndexOf(" of");
    let yourIndex = text.lastIndexOf(" your");
    let theIndex = text.indexOf("the "); // beginning

    let lastIndex = Math.max(onIndex, ofIndex, yourIndex);
    let firstIndex = theIndex;

    text = text
      .substring(
        firstIndex != -1 ? firstIndex : 0,
        lastIndex != -1 ? lastIndex : text.length
      )
      .trim();

    let length = text.length;
    if (text.endsWith(" on") || text.endsWith(" of"))
      text = text.substring(0, length - 2);
    else if (text.endsWith(" the")) text = text.substring(0, length - 3);
    else if (text.endsWith(" your")) text = text.substring(0, length - 4);

    text = text.trim();

    // remove all "on", "of", "your", and "the" keywords at the beginning of string
    if (text.startsWith("on ") || text.startsWith("of "))
      text = text.substring(2, length);
    else if (text.startsWith("the ")) text = text.substring(3, length);
    else if (text.startsWith("your ")) text = text.substring(4, length);

    text = text.trim();

    //   capitalize each word
    text = text.replace(/\b\w/g, (l) => l.toUpperCase());
    // replaces all "n" white spaces with just 1 white space
    text = text.replace(/\s\s+/g, " ");
    return text.trim();
  },
  loopBody: ($, body) => {
    let block = [];
    const mapping = {
      h3: "heading-3",
      h4: "heading-4",
      p: "paragraph",
      figure: "embedded-asset-block",
    };
    let h2Count = 0;
    body.children().each(async (i, c) => {
      let type = mapping[c.name];
      if (c.name == "h2") h2Count++;
      if (h2Count < 2) {
        let value = "";
        switch (type) {
          case "heading-3":
            value = $("span", c).text().trim();
            value = await module.exports.trimHeader(value);
            if (value !== "") block[i] = { type, value };
            break;
          case "heading-4":
            value = $("span", c).text().trim();
            value = await module.exports.trimHeader(value);
            if (value !== "") block[i] = { type: "heading-4", value };
            break;
          case "paragraph":
            value = $(c).text().trim();
            if (value !== "") block[i] = { type, value };
            break;
          case "embedded-asset-block":
            value = $("a", c).attr("href");
            block[i] = { type, value };
            break;
        }
      }
    });
    return block;
  },
  formatBody: (body) => {
    let content = body.map((item) => {
      let nodeType = item.type;
      //   if (nodeType == "heading-3" || nodeType == "paragraph")
      return {
        data: {},
        nodeType: nodeType == "embedded-asset-block" ? "paragraph" : nodeType,
        content: [{ data: {}, marks: [], value: item.value, nodeType: "text" }],
      };
      //   else if (nodeType == "embedded-asset-block") {
      //     const sys = {
      //       id: ENTRY_ID,
      //       type: "Link",
      //       linkType: "Asset",
      //     };
      //     return {
      //       nodeType,
      //       content: [],
      //       data: {
      //         target: {
      //           sys,
      //         },
      //       },
      //     };
      //   }
    });
    return { data: {}, nodeType: "document", content };
  },
};

// remove all the content at the outro of the legit check guide
//      - After the text says 60 seconds (or another way to measure when to stop)
// rytr to change all the text
//
// compile a list of urls and loop through for each of them
// change the images for each of the assets
