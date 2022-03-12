module.exports = {
  ryte: async (sentence) => {
    // try {
    let API_KEY = API_KEY_LIST[Math.floor(Math.random() * API_KEY_LIST.length)];
    return await axios.post(
      `https://api.rytr.me/v1/ryte`,
      {
        languageId: process.env.LANGUAGE_ID,
        toneId: process.env.TONE_ID,
        useCaseId: process.env.REWORD_USE_CASE_ID,
        inputContexts: { [process.env.USE_CASE_KEY_LABEL]: sentence },
        variations: 1,
        userId: "USER1",
        format: "text",
        creativityLevel: "max",
      },
      {
        headers: {
          Authentication: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // const { data } = await axios({
    //   method: "post",
    //   url: "https://api.rytr.me/v1/ryte",
    //   headers: {
    //     Authentication: `Bearer ${API_KEY}`,
    //     "Content-Type": "application/json",
    //   },
    //   data: {
    //     languageId: process.env.LANGUAGE_ID,
    //     toneId: process.env.TONE_ID,
    //     useCaseId: process.env.REWORD_USE_CASE_ID,
    //     inputContexts: { [process.env.USE_CASE_KEY_LABEL]: sentence },
    //     variations: 1,
    //     userId: USER_ID,
    //     format: "text",
    //     creativityLevel: "max",
    //   },
    // });
    // console.log("original sentence inside loop\n", sentence);
    // console.log("res inside loop\n", res.data.data);
    // return res.data ? res.data.data : null;
    // } catch (error) {
    //   console.log(error);
    // }

    // return null;
  },
};
