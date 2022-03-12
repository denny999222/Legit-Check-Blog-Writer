const contentful = require("contentful-management");
const fs = require("fs");

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

module.exports = {
  addGuide: async (fields) => {
    // Create entry
    client
      .getSpace(process.env.CONTENTFUL_SPACE)
      .then((space) => space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT))
      .then((environment) =>
        environment.createEntry(process.env.CONTENTFUL_CONTENT_TYPE, { fields })
      )
      .then((entry) => {
        console.log("success entry created: ");
        fs.appendFile(
          "finishedUrls.txt",
          `${JSON.stringify(fields)}\n\n\n`,
          (e) => console.log(e)
        );
      })
      .catch((e) => {
        fs.writeFile(`error.txt`, e.toString(), (err) => {
          if (err) {
            console.error(err);
            return;
          }
          //file written successfully
        });
      });
  },
  addAsset: async (url) => {
    return await client
      .getSpace(process.env.CONTENTFUL_SPACE)
      .then((space) => space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT))
      .then((environment) =>
        environment.createAsset({
          fields: {
            title: {
              "en-US": "Sneaker Image Angle",
            },
            file: {
              "en-US": {
                contentType: "image/jpeg",
                fileName: "example.jpeg",
                upload: url,
              },
            },
          },
        })
      )
      .then((asset) => asset)
      .catch(console.error);
  },
};
