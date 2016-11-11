import React, { Component, PropTypes } from 'react';
import Button from './button';
import classNames from 'classnames';
import moment from 'moment';
import { isEmpty } from 'lodash/lang';

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
          <li key={idx}>{attendee.email}</li>
        );
      });
    }
  }

  render() {
    const { displayedEvent } = this.props;

    if (!displayedEvent || !displayedEvent.id || isEmpty(displayedEvent)) {
      return (
        <div className='event-details'>
          <h3 className="event-details-status">
            {displayedEvent.isCurrent ? 'Current Meeting' : 'Coming up'}
          </h3>
        </div>
      );
    }

    const startTime = moment(displayedEvent.start.dateTime);
    const endTime = moment(displayedEvent.end.dateTime);

    const btnClasses = classNames({
      small: true,
      'expand-btn': true,
      expanded: this.props.expanded,
    });

    return (
      <div className='event-details'>
        <Button icon="arrow-up" className={btnClasses} handleClick={this.handleExpandDetails.bind(this)}/>
        <h3 className="event-details-status">
          {displayedEvent.isCurrent ? 'CURRENT MEETING' : 'COMING UP'}
        </h3>
        <h3 className="event-details-name">{displayedEvent.summary}</h3>
        <p className="event-details-time">{`${startTime.format("hh:mm")} - ${endTime.format("hh:mm")}`}</p>
        <p className="event-details-creator">{displayedEvent.creator.email}</p>
        <ul className="event-details-attendees">{this.attendees()}</ul>
      </div>
    );
  }
}
