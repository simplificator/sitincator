import React, { Component, PropTypes } from 'react';
import { ipcRenderer } from 'electron';
import moment from 'moment';
import EventDuration from './event_duration';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { isCurrent, timeLeft, isBeforeNow, isAfterNow } from '../util';

export default class Schedule extends Component {
  static propTypes = {
    events: PropTypes.array,
    nextEvent: PropTypes.object,
    nextEventIdx: PropTypes.number,
    onQuickReservation: PropTypes.func,
    onFinishReservation: PropTypes.func,
    onShowSchedule: PropTypes.func
  }

  constructor(props) {
    super(props);
  }

  scrollTimeLineIntoView() {
    this.refs.timeLinePosition.scrollIntoView({behavior: 'instant'});
  }

  componentDidMount() {
    if (this.refs.timeLinePosition) {
      this.scrollTimeLineIntoView();
    }
  }

  componentDidUpdate() {
    if (this.refs.timeLinePosition) {
      this.scrollTimeLineIntoView();
    }
  }

  timeLine() {
    return (
      <span className="time-line"></span>
    );
  }

  scrollToTimeLine(container) {
    if (container === null) {
      return;
    }
    container.scrollIntoView({behavior: 'instant'});
  }

  render() {
    const { events } = this.props;
    const displayedEvents = events.map((event, index) => {
      let eventBefore = index > 0 ? events[index-1] : null;
      let isBefore = eventBefore ? isBeforeNow(eventBefore) && isAfterNow(event) : isAfterNow(event);

      return (
        <div className="flex-container schedule-event" key={index}>
          {isBefore ? <span ref="timeLinePosition"></span> : null}
          {isBefore ? this.timeLine() : null }
          <EventDuration event={event} />
          {(isCurrent(event)) ? this.timeLine() : null }
          <h3 className="schedule-event-name">{event.summary}</h3>
        </div>
      )
    });

    // Special case where the time line is located after all events
    if (events.length > 0 && timeLeft(events[events.length-1]) < 0) {
      displayedEvents.push((
        <div className="flex-container schedule-event" key={events.length}>
          <span ref="timeLinePosition"></span>
          <h3 className="schedule-event-name"></h3>
          {this.timeLine()}
        </div>
      ));
    }

    return (
      <ReactCSSTransitionGroup
        transitionName="fade"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}>
        <div className="flex-container schedule">
          <h3 className="schedule-header">{(moment().format("dddd, DD.MM.YYYY")).toUpperCase()}</h3>
          <div className="schedule-event-list">
            <div className="flex-container">
              {displayedEvents}
            </div>
          </div>
        </div>
      </ReactCSSTransitionGroup>
    );
  }
}
