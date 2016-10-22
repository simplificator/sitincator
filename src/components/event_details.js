import React, { Component, PropTypes } from 'react';

export default class EventDetails extends Component {
  static props = {
    displayedEvent: PropTypes.object,
    handleShowSchedule: PropTypes.func,
  }

  render() {
    var duration = 0;
    
    if (this.props.displayedEvent.id) {
      duration = Date.parse(this.props.displayedEvent.start.dateTime) - Date.now();
    }

    return ( 
      <div className='event-details'>
        <h3>
          {this.props.displayedEvent.current ? 'Current Meeting' : 'Coming up'}
          <span>{`For the next ${duration}`}</span>
        </h3>
        <p>{this.props.displayedEvent.summary}</p>
        <a onClick={this.props.handleShowSchedule}>full schedule</a>
      </div>
    );
  }
}
