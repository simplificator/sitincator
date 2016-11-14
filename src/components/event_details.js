import React, { Component, PropTypes } from 'react';
import Button from './button';
import classNames from 'classnames';
import { isEmpty } from 'lodash/lang';
import EventDuration from './event_duration';

export default class EventDetails extends Component {
  static props = {
    displayedEvent: PropTypes.object,
    expanded: PropTypes.bool,
    handleShowSchedule: PropTypes.func.isRequired,
    handleExpandDetails: PropTypes.func.isRequired,
  }

  static defaultProps = {
    expanded: false,
  };

  constructor(props) {
    super(props);
  }

  handleExpandDetails() {
    this.props.handleExpandDetails();
  }

  attendees() {
    const { displayedEvent } = this.props;
    if (!displayedEvent.attendees) {
      return null;
    } else {
      return displayedEvent.attendees.map((attendee, idx) => {
        return (
          <li key={idx}>{attendee.displayName || attendee.email}</li>
        );
      });
    }
  }

  render() {
    const { displayedEvent } = this.props;

    if (isEmpty(displayedEvent)) {
      return (
        <div className='event-details flex-container'>
          <h3 className="event-details-status">
            {'NO UPCOMING EVENTS'}
          </h3>
        </div>
      );
    }

    const btnClasses = classNames({
      small: true,
      'expand-btn': true,
      expanded: this.props.expanded,
    });

    return (
      <div className='event-details flex-container'>
        <Button icon="arrow-up" className={btnClasses} handleClick={this.handleExpandDetails.bind(this)}/>
        <h3 className="event-details-status">
          {displayedEvent.isCurrent ? 'CURRENT MEETING' : 'COMING UP'}
        </h3>
        <h3 className="event-details-name">{displayedEvent.summary}</h3>
        <EventDuration event={displayedEvent} />
        <p className="event-details-creator">{displayedEvent.creator.displayName || displayedEvent.creator.email}</p>
        <ul className="event-details-attendees">{this.attendees()}</ul>
      </div>
    );
  }
}
