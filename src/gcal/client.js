const google = require('googleapis');

let _auth, _calendarId;
const calendar = google.calendar('v3');

module.exports = class Client {
  constructor(calendarId, auth) {
    _calendarId = calendarId
    _auth = auth;
  }

  listEvents() {
    const timeMin = new Date(new Date(2016, 9, 24).setHours(0, 0, 0, 0)).toISOString();
    const timeMax = new Date(new Date(2016, 9, 24).setHours(23, 59, 59)).toISOString();
    return new Promise((resolve, reject) => {
      calendar.events.list({
        auth: _auth,
        calendarId: _calendarId,
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: 'startTime'
      }, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.items);
        }
      });
    });
  }

  statusEvent() {
    const now = new Date(2016, 9, 24, 13, 4, 12).getTime();
    return this.listEvents()
      .then(events => {
        const item = events.find(event => {
          const start = new Date(event.start.dateTime).getTime();
          const end = new Date(event.end.dateTime).getTime();
          if (now > start && now < end) {
            event.isCurrent = true
            return true;
          }
          if (now < start) {
            return true;
          };
        });
        return item;
      });
  }
}
