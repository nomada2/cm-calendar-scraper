var logger = require("./logger.js"),
    ICS = require("ics-js");
var secrets = require("../secrets.json");
var cal = module.exports = {};

// save : function : Promise
cal.save = function save(filename) {
  return function save_inner(events) {
    // generate calendar
    var cal = new ICS.VCALENDAR();
    cal.addProp("VERSION", 2);
    cal.addProp('PRODID', 'JFagerberg: CM-Scraper');

    // generate events
    for (var i = 0; i < events.length; ++i) {
      var ev = events[i];

      var e = new ICS.VEVENT();
      e.addProp("UID");
      e.addProp("DTSTART", ev.start.toDate());
      e.addProp("DTEND", ev.end.toDate());
      e.addProp("DTSTAMP", new Date());
      e.addProp("DESCRIPTION", "Arbejde");

      cal.addComponent(e);
    };

    return new Promise(function(res,rej){
      fs.writeFile(filename, cal.toString(), function(err){
        if (err) {
          return rej(err);
        } else {
          res();
        }
      });
    });
  }
};
