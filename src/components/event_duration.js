import React, { Component } from 'react';
import moment from 'moment';
import { isEmpty } from 'lodash/lang';
import { isAllDayEvent } from '../util';

export default class EventDuration extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { event } = this.props;
    const startTime = moment(event.start.dateTime);
    const endTime = moment(event.end.dateTime);

    if (isEmpty(event)) {
      return null;
    }

    const isAllDay = isAllDayEvent(event)
    return (
      <p className="event-duration">
        {isAllDay ?
          'All Day Event' :
          `${startTime.format("H:mm")} - ${endTime.format("H:mm")}`
        }
      </p>
    );
  }
}
