const translate = require("@vitalets/google-translate-api");

const redis = require("redis");
const REDIS_PORT = process.env.PORT || 6379;

const client = redis.createClient(REDIS_PORT);

const ISO6391 = require("iso-639-1");

const similarLanguagesList = [
  ["hi", "kn", "ta", "te", "bn", "gu", "pa"],
  ["en", "fr", "it"],
];

// cache function to create a cache for similar languages

function smartCache(languageCode, text) {
  // search for similar languages inside the array
  for (let i = 0; i < similarLanguagesList.length; i++) {
    let index = similarLanguagesList[i].indexOf(languageCode);

    // if language is not there in list then continue
    if (index == -1) {
      continue;
    }

    for (let j = 0; j < similarLanguagesList[i].length; j++) {
      if (j != index) {
        console.log("similar language", similarLanguagesList[i][j]);
        translate(text, { to: similarLanguagesList[i][j] })
          .then((response) => {
            // console.log(response.text);

            // Set data to Redis
            let key = text + "-" + similarLanguagesList[i][j];
            client.setex(key, 2000, response.text);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }
}

//  translate the text

module.exports.translateText = function (req, res) {
  let languageCode = ISO6391.getCode(req.body.language);

  // cache function for setting the keys for other related languages
  smartCache(languageCode, req.body.text);

  translate(req.body.text, { to: languageCode })
    .then((response) => {
      //   console.log(response.text);

      // Set data to Redis (enter data in cache)
      let key = req.body.text + "-" + languageCode;

      client.setex(key, 2000, response.text);

      return res.status(200).json({
        message: "Here is the translated text",
        data: response.text,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        error: "internal server error",
      });
    });
};
