import { applyMiddleware } from 'redux';
import { EventsMiddleware } from './events_middleware';

// collects at least one middleware function and connects it to our store
const masterMiddleWare = applyMiddleware(EventsMiddleware)

export default masterMiddleWare
