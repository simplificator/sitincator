import { RECEIVE_EVENTS } from './../actions/event_actions';

const EventsReducer = (state = [], action) => {
  switch(action.type) {
    case RECEIVE_EVENTS:
      return action.events
    default:
      return state;
  }
};

export default EventsReducer;
