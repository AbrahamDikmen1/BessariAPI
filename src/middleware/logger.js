const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromise = require("fs").promises;
const path = require("path");

const logEvents = async (message, logFileName) => {
  const dataTime = `${format(new Date(), "yyyymmdd\tHH:mm:ss")}`;
  const logItem = `${dataTime}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(dirname, "..", "logs"))) {
      await fsPromise.mkdir(path.join(dirname, "..", "logs"));
    }
    await fsPromise.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};
const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
  console.log(`${req.method} ${req.path}`);
  next();
};
module.exports = { logEvents, logger };
