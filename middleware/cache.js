const REDIS_PORT = process.env.PORT || 6379;
const redis = require("redis");

const client = redis.createClient(REDIS_PORT);

// Codes for the representation of names of languages
const ISO6391 = require("iso-639-1");

module.exports.cache = function (request, response, next) {
  if (request.body.text.length == 0) {
    // 422 status code occurs when a request is well-formed, however, due to semantic errors it is unable to be processed.
    return response.json(422, {
      message: "Please enter text",
    });
  }
  let languageCode = ISO6391.getCode(request.body.language);
  let key = request.body.text + "-" + languageCode;

  // cache hit
  client.get(key, (error, data) => {
    if (error) {
      throw error;
    }
    if (data !== null) {
      // middleware used
      return response.status(200).json({
        message: "The Translated Text Is:",
        data: data,
      });
    } else {
      next();
    }
  });
};
