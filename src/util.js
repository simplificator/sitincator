export const nextEvent = (events) => {
  return (
    events.find(event => {
      const start = new Date(event.start.dateTime).getTime();
      const end = new Date(event.end.dateTime).getTime();
      if (now > start && now < end) {
        event.isCurrent = true
        return true;
      };

      if (now < start) {
        return true;
      };

    })
  );
}

export const nextEventIdx = (events) => {
  return (
    events.findIndex(event => {
      const start = new Date(event.start.dateTime).getTime();
      const end = new Date(event.end.dateTime).getTime();
      if (now > start && now < end) {
        event.isCurrent = true
        return true;
      }
      if (now < start) {
        return true;
      };
    })
  );
}
