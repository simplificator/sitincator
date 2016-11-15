import React, { Component, PropTypes } from 'react';
import Button from './button';
import classNames from 'classnames';
import { isEmpty } from 'lodash/lang';
import EventDuration from './event_duration';

export default class EventDetails extends Component {
  static props = {
    nextEvent: PropTypes.object,
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
    const { nextEvent } = this.props;
    if (!nextEvent.attendees) {
      return null;
    } else {
      return nextEvent.attendees.map((attendee, idx) => {
        if (attendee.resource) {
          return null;
        }
        return (
          <li key={idx}>{attendee.displayName || attendee.email}</li>
        );
      })
    }
  }

  render() {
    const { nextEvent, expanded } = this.props;

    if (isEmpty(nextEvent)) {
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
      expanded: expanded,
    });

    return (
      <div className='event-details flex-container'>
        <Button icon="arrow-up" className={btnClasses} handleClick={this.handleExpandDetails.bind(this)}/>
        <h3 className="event-details-status">
          {nextEvent.isCurrent ? 'CURRENT MEETING' : 'COMING UP'}
        </h3>
        <h3 className="event-details-name">{nextEvent.summary}</h3>
        <EventDuration event={nextEvent} />
        <p className="event-details-creator">{nextEvent.creator.displayName || nextEvent.creator.email}</p>
        <ul className="event-details-attendees">{this.attendees()}</ul>
      </div>
    );
  }
}
