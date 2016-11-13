import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import moment from 'moment';
import EventDuration from './event_duration';
import { isEmpty } from 'lodash/lang';
import { nextEventIdx } from './../util';

const STATUS_UPDATE_INTERVAL_MS = 60000;

export default class Schedule extends Component {
  constructor(props) {
    super(props);
    this.setUpdateDisplayedEventsInterval = this.setUpdateDisplayedEventsInterval.bind(this);
    this.state = {
      displayedEvents: [],
      nextEventIdx: 0,
      isCurrent: true
    };
  }

  componentDidMount() {
    ipcRenderer.send('calendar:list-events');
    ipcRenderer.on('calendar:list-events-success', (event, displayedEvents) => {
      this.receiveEvents(displayedEvents);
    });
    ipcRenderer.on('calendar:list-events-failure', (event, error) => console.error(error));

  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners();
    clearInterval(this.updateEventsInterval);
  }

  receiveEvents(displayedEvents) {
    const nextEventIdx = 0; //nextEventIdx(displayedEvents);
    const isCurrent = true; //nextEvent.isCurrent;
    this.setState({
      displayedEvents,
      nextEventIdx,
      isCurrent
    });

  }

  setUpdateDisplayedEventsInterval() {
    this.updateEventsInterval = setInterval(() => {
      ipcRenderer.send('calendar:status-event');
    }, STATUS_UPDATE_INTERVAL_MS);
  }

  timeLine() {
    return (
      <span className="time-line"></span>
    );
  }

  render() {

    const { displayedEvents, nextEventIdx, isCurrent } = this.state;
    const events = displayedEvents.map((event, idx) => {

      return (
        <div className="flex-container schedule-event" key={idx}>
          {((nextEventIdx === idx) && isCurrent) ? this.timeLine() : null }
          <EventDuration event={event} />
          {((nextEventIdx === idx) && !isCurrent) ? this.timeLine() : null }
          <h3 className="schedule-event-name">{event.summary}</h3>
        </div>
      )
    })
    return (
      <div className="flex-container schedule">
        <h3 className="schedule-header">{(moment().format("dddd, DD.MM.YYYY")).toUpperCase()}</h3>
        <div className="flex-container schedule-event-list">
          {events}
        </div>
      </div>
    );
  }
}
