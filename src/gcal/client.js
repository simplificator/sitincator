const google = require('googleapis');

let _auth, _calendarId;
const calendar = google.calendar('v3');

const MILLISECONDS_PER_MINUTE = 60000;

module.exports = class Client {
  constructor(calendarId, auth) {
    _calendarId = calendarId
    _auth = auth;
  }

  listEvents() {
    const timeMin = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
    const timeMax = new Date(new Date().setHours(23, 59, 59)).toISOString();
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

  insertEvent() {
    const now = new Date();
    return new Promise((resolve, reject) => {
      const event = {
        description: 'Quick Reservation 15\'',
        start: {
          dateTime: now.toISOString(),
        },
        end: {
          dateTime: new Date(now.getTime() + 15 * MILLISECONDS_PER_MINUTE).toISOString(),
        },
      };
      calendar.events.insert({
        auth: _auth,
        calendarId: _calendarId,
        resource: event,
      }, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
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
