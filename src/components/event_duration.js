import React, { Component } from 'react';
import moment from 'moment';
import { isEmpty } from 'lodash/lang';

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

    return (
      <p className="event-duration">{`${startTime.format("H:mm")} - ${endTime.format("H:mm")}`}</p>
    );
  }
}
