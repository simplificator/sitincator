import React, { Component, PropTypes } from 'react';
import { ipcRenderer } from 'electron';
import moment from 'moment';
import EventDuration from './event_duration';
import { isEmpty } from 'lodash/lang';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const STATUS_UPDATE_INTERVAL_MS = 60000;

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
    const { events, nextEvent, nextEventIdx } = this.props;
    const displayedEvents = events.map((event, idx) => {
      let isNextEvent = (nextEventIdx === idx);
      // used for scrolling down to the event right before the current one
      let isBeforeNext = (nextEventIdx === idx + 1);
      return (
        <div className="flex-container schedule-event" key={idx}>
          {isBeforeNext ? <span ref="timeLinePosition"></span> : null}
          {(isNextEvent && !event.isCurrent) ? this.timeLine() : null }
          <EventDuration event={event} />
          {(isNextEvent && event.isCurrent) ? this.timeLine() : null }
          <h3 className="schedule-event-name">{event.summary}</h3>
        </div>
      )
    })
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
