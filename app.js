var logger = require("./scripts/logger.js"),
    CM = require("./scripts/cm.js");
    cal = require("./scripts/cal.js"),
    fs = require("fs");

CM.login()
  .then(()=>CM.fetchEvents(4))
  .then(cal.save("work.ics"))
  .then(logger.info)
  .catch(logger.error);
