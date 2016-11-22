import { combineReducers } from 'redux';
import EventsReducer from './events_reducer';

const RootReducer = combineReducers({
  events: EventsReducer
});

export default RootReducer;
