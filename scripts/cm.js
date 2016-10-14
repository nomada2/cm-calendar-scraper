var request = require("request"),
    moment = require("moment"),
    logger = require("./logger.js");
var secrets = require("../secrets.json");

request = request.defaults({
  headers: {
    "User-Agent": "Scraper, JF-Calendar"
  },
  baseUrl: "https://cleanmanager.dk/",
  jar: true,
  followAllRedirects: true
});

var CM = module.exports = {};
// login : Promise(body)
CM.login = function login() {
  return new Promise(function(res,rej){
    request.post({
      url:"public_request.php?task=LoginUser",
      form: {
        username: secrets.user,
        password: secrets.pass
      }
    }, function(err, resp, body) {
      if (err) {
        rej(err);
      } else {
        res(body);
      }
    });
  });
}

// fetchEvents : Promise(arr)
CM.fetchEvents = function calendar(weeks) {
  var startTime = moment().startOf("week"),
      endTime = moment(startTime).add(4, "weeks");
  var tFormat = "YYYY-MM-DD";

  logger.info("Requesting: ",startTime.format(tFormat),"-",endTime.format(tFormat),"("+weeks+")");

  return new Promise(function(res,rej){
    request({
      url: "request.php",
      qs: {
        get: "Cleaning",
        start: startTime.format("YYYY-MM-DD"),
        end: endTime.format("YYYY-MM-DD"),
        sortby: "com",
        sortid: -1,
        shownotes: false,
        showabsence: false
      },
      json: true
    }, function(err,resp,body){
      if (err || !body.success) {
        if (!err) {
          err = new Error("CM failed: ",body);
        }
        return rej(err);
      } else {
        // generate events of format: {start: <Date>, end: <Date>}
        var evts = body.cleaning.map(v => {
          if (v.active === false) { return; }
          return {
            start: moment(v.start_date + " " + v.start_time),
            end: moment(v.end_date + " " + v.end_time)
          };
        });
        return res(evts);
      }
    });
  });
}
