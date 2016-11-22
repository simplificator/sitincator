import { REQUEST_EVENTS, RECEIVE_EVENTS, requestEvents, receiveEvents } from './../actions/event_actions';
import { fetchEvents } from './../util/events_api_util.js';

export const EventsMiddleware = ({ getState, dispatch }) => next => action => {
  const requestEventsSuccess = events => {
    dispatch(receiveEvents(events));
  }
  switch(action.type) {
    case REQUEST_EVENTS:
      fetchEvents(requestEventsSuccess);
      return next(action);
    default:
      return next(action);
  }
};
