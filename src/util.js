export const nextEvent = (events) => {
  return (
    events.find((e) => {
      const start = new Date(e.start.dateTime).getTime();
      const end = new Date(e.end.dateTime).getTime();
      if (now > start && now < end) {
        e.isCurrent = true
        return true;
      }
      if (now < start) {
        return true;
      };
    })
  );
}

export const nextEventIdx = (events) => {
  return (
    events.findIndex((e) => {
      const start = new Date(e.start.dateTime).getTime();
      const end = new Date(e.end.dateTime).getTime();
      if (now > start && now < end) {
        e.isCurrent = true
        return true;
      }
      if (now < start) {
        return true;
      };
    })
  );
}
