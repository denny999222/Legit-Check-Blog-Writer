const cheerio = require("cheerio");
const axios = require("axios");
const Helper = require("./helper");

module.exports = {
  scrape: async (url) => {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const title =
      $("body > div:nth-child(3) > h1").text().split("Guide")[0] +
      "Legit Check Guide";
    const brand = $(
      "body > div:nth-child(3) > div.breadcrumb-div > ul > li:nth-child(1) > a"
    ).text();
    const slug = title.split(" ").join("-");
    const featuredImage = $("body > div:nth-child(3) > img").attr("src");
    let description = `Find out how to legit check and compare ${
      title.split("Guide")[0]
    } sneakers`;
    let body = $(
      "body > div:nth-child(3) > div.rte-wrapper > div.rich-text-block-blog-post.w-richtext"
    );
    body = Helper.loopBody($, body);

    return {
      slug: { "en-US": slug },
      brand: { "en-US": brand },
      title: { "en-US": title },
      description: { "en-US": description },
      body,
    };
  },
};
