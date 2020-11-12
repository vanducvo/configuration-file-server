const env = process.env.NODE_ENV;

exports.module = require(`./${env}.js`);
