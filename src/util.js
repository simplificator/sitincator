import humanizeDuration from 'humanize-duration';

export const nextEvent = (events) => {
  const now = new Date().getTime();
  const item = events.find((e) => {
    const start = new Date(e.start.dateTime).getTime();
    const end = new Date(e.end.dateTime).getTime();
    if (now > start && now < end) {
      e.isCurrent = true
      return true;
    }
    if (now < start) {
      return true;
    };
  });
  return item || {};
}

export const nextEventIdx = (events) => {
  return events.findIndex((e) => {
    const now = new Date().getTime()
    const start = new Date(e.start.dateTime).getTime();
    const end = new Date(e.end.dateTime).getTime();

    if (now > start && now < end) {
      e.isCurrent = true
      return true;
    }
    if (now < start) {
      return true;
    };
  });
}

export const timeToEvent = (event) => {
  return (Date.parse(event.start.dateTime) - Date.now());
}

export const humanReadableDuration = (ms) => {
  // largest: max number of units to display, round: round to smallest unit displayed 
  return humanizeDuration(ms, { largest: 1, round: true, units: ['d', 'h', 'm'] });
}
