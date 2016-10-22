import { Router, Route, Link, hashHistory } from 'react-router';
import React from 'react';
import { render } from 'react-dom';
import Status from './components/status';
import Schedule from './components/schedule';

import '../static/sass/main.scss';

function currentHash() {
  return window.location.hash;
}

function isStatusView() {
  return /status/.test(currentHash());
}

const App = React.createClass({
  componentDidMount: function() {
    window.location.hash = 'status';
  },

  handleFooterClick() {
    window.location.hash = isStatusView() ? 'schedule' : 'status';
  },

  render: function() {
    const footerText = isStatusView() ?
      <span>full schedule <i className="icon icon-arrow-right"></i></span> :
      <span><i className="icon icon-arrow-left"></i> back to booking</span>;
    return (
      <div id="app">
        {this.props.children}
        <footer>
          <a onClick={this.handleFooterClick}>{footerText}</a>
        </footer>
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
