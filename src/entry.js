import { Router, Route, Link, hashHistory, IndexRoute } from 'react-router';
import React from 'react';
import { render } from 'react-dom';
import Status from './components/status';
import Schedule from './components/schedule';
import App from './app';

import '../static/sass/main.scss';

window.location.hash = 'status';

render((
  <Router history={hashHistory}>
    <Route path="/status" component={App}>
      <IndexRoute component={Status} />
      <Route path="/schedule" component={Schedule} />
    </Route>
  </Router>
), document.getElementById('react-root'));
