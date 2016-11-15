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
