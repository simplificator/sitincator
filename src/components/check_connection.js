import React, { Component, PropTypes } from 'react';

console.log("check_connection : " + remote.getGlobal('sharedObj').calendarName)

export default class CheckConnection extends Component {
  render() {
    return (
      <div className="no-connection">
        <div className="icon"><i className="icon icon-no-connection"></i></div>
        <h3 className="text">Failed to connect to the Google Calendar API</h3>
	<h4>{ remote.getGlobal('sharedObj').calendarName }</h4>
      </div>
    )
  }
}
