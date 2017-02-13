import humanizeDuration from 'humanize-duration';

export const nextEvent = (events) => {
  const now = new Date().getTime();

  const sortedEvents = events.sort(function(a, b) {
    return new Date(a.start.dateTime).getTime() - new Date(b.start.dateTime).getTime();
  });

  const futureEvents = sortedEvents.filter(function(event) {
    return new Date(event.start.dateTime).getTime() > now;
  });

  return futureEvents[0] || {};
};

export const nextEventIdx = (events) => {
  const nextEvent = exports.nextEvent(events);

  return events.indexOf(nextEvent);
};

export const currentEvent = (events) => {
  const now = new Date().getTime();

  const currentEvents = events.filter(function(event) {
    const eventStart = new Date(event.start.dateTime).getTime();
    const eventEnd = new Date(event.end.dateTime).getTime();

    return eventStart <= now && eventEnd >= now;
  });

  return currentEvents[0] || {};
};

export const timeToEvent = (event) => {
  return (Date.parse(event.start.dateTime) - Date.now());
};

export const timeLeft = (event) => {
  return Date.parse(event.end.dateTime) - Date.now();
};

export const humanReadableDuration = (ms) => {
  // largest: max number of units to display, round: round to smallest unit displayed
  return humanizeDuration(ms, { largest: 1, round: true, units: ['d', 'h', 'm'] });
};
