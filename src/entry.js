import { Router, Route, Link, hashHistory } from 'react-router';
import React from 'react';
import { render } from 'react-dom';
import Status from './components/status';
import Schedule from './components/schedule';
import App from './app';

import '../static/sass/main.scss';

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <Route path="status" component={Status}/>
      <Route path="schedule" component={Schedule}/>
    </Route>
  </Router>
), document.getElementById('react-root'));
