// Exports a winston instance

var winston = require("winston"),
    mailgun = require("winston-mailgun").MailGun;

var secrets = require("../secrets.json"),
    mailSecrets = secrets.logger.mailgun;

function objSearch(obj, keys, arr) {
  var outp = arr || [];
  for (var k in obj) {
    if (keys.indexOf(k) !== -1 && typeof obj[k] === "string" && outp.indexOf(obj[k]) === -1) {
      outp.push(obj[k]);
    }
    if (obj[k] instanceof Object) {
      outp = outp.concat(objSearch(obj[k], keys, outp));
    }
  }
  return outp;
}
var filterStrings = objSearch(secrets, ["pass", "password", "apiKey", "key"]);

module.exports = new (winston.Logger)({
  exitOnError: false,
  filters: [
    function(level,msg,meta){
      var outp = msg;
      for (var i = 0; i < filterStrings.length; ++i) {
        while (outp.indexOf(filterStrings[i]) !== -1) {
          outp = outp.replace(filterStrings[i], "******");
        }
      }
      return outp;
    }
  ],
  transports: [
    new (winston.transports.Console)({
      timestamp: true,
      colorize: true,

      handleExceptions: true,
      humanReadableExceptions: true
    }),
    new (winston.transports.File)({
      filename: "scraper.log",
      timestamp: true,

      handleExceptions: true,
      humanReadableExceptions: true
    }),
    /*new (winston.transports.MailGun)({
      apiKey: mailSecrets.key,
      domain: mailSecrets.domain,
      to: "johanringmann@gmail.com",
      from: "cm-scraper@jfagerberg.com",
      subject: "Script error: cm-scraper",
      level: "error",

      handleExceptions: true,
      humanReadableExceptions: true
    })*/
  ]
});
