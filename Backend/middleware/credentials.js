const allowedOrigins = require("../config/allowedOrigins");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  console.log("credentials.js: Received Origin:", origin);
  if (allowedOrigins.includes(origin)) {
    console.log("credentials.js: Origin allowed");
    res.header("Access-Control-Allow-Credentials", true);
  } else {
    console.log("credentials.js: Origin NOT allowed");
  }
  next();
};

module.exports = credentials;
