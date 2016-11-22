export const REQUEST_EVENTS = "REQUEST_EVENTS";
export const RECEIVE_EVENTS = "RECEIVE_EVENTS";

export const requestEvents = () => ({
  type: REQUEST_EVENTS
});

export const receiveEvents = events => ({
  type: RECEIVE_EVENTS,
  events
});
