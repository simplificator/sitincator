import { Router, Route, Link, hashHistory, IndexRoute } from 'react-router';
import React from 'react';
import { render } from 'react-dom';
import Status from './components/status';
import Schedule from './components/schedule';
import App from './app';
import configureStore from './store/store';
import { requestEvents } from './actions/event_actions';

import '../static/sass/main.scss';

window.location.hash = 'status';
window.store = configureStore();
window.requestEvents = requestEvents;
window.store.dispatch(requestEvents);

const routes = (
  <Route path="/status" component={App}>
    <IndexRoute component={Status} />
    <Route path="/schedule" component={Schedule} />
  </Route>
);

render((
  <Router history={hashHistory}>
    {routes}
  </Router>
), document.getElementById('react-root'));
