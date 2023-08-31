const rateLimit = require("express-rate-limit");
const { loginEvents } = require("./logger");

const loginLimiter = rateLimit({
  windowMs: 60 * 100, // 1 min
  max: 3, // 3 attempts
  message: {
    message:
      "Too many login attempts from this IP, please try again after a 60 second pause",
  },
  handler: (req, res, next, options) => {
    loginEvents(
      `Too many requests: ${options.message.message}\t${req.method}\t${req.method}\t${req.url}\t${req.headers.orgin}`,
      "errLog.log"
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // Return rate lmit info in the 'RateLimit' headers
  legacyHeaders: false, // Disable the 'X-RateLimit' headers
});
module.exports = loginLimiter;
