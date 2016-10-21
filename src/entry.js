import { Router, Route, Link, hashHistory } from 'react-router';
import React from 'react';
import { render } from 'react-dom';
import Status from './components/status';
import Schedule from './components/schedule';

import '../static/sass/main.scss';

const App = React.createClass({
  componentDidMount: function() {
    window.location.hash = 'status';
  },

  render: function() {
    return (
      <div>
        <h1>Hello from React and Manuel and Marcus!</h1>
        {this.props.children}
      </div>
    )
  }
});

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <Route path="status" component={Status}/>
      <Route path="schedule" component={Schedule}/>
    </Route>
  </Router>
), document.getElementById('react-root'));
