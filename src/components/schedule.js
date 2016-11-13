import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import moment from 'moment';
import EventDuration from './event_duration';

const STATUS_UPDATE_INTERVAL_MS = 60000;

export default class Schedule extends Component {
  constructor(props) {
    super(props);
    this.setUpdateDisplayedEventsInterval = this.setUpdateDisplayedEventsInterval.bind(this);
    this.state = {
      displayedEvents: []
    };
  }

  componentDidMount() {
    ipcRenderer.send('calendar:list-events');
    ipcRenderer.on('calendar:list-events-success', (event, displayedEvents) => {
      this.setState({ displayedEvents })
    });
    ipcRenderer.on('calendar:list-events-failure', (event, error) => console.error(error));

  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners();
    clearInterval(this.updateEventsInterval);
  }

  setUpdateDisplayedEventsInterval() {
    this.updateEventsInterval = setInterval(() => {
      ipcRenderer.send('calendar:status-event');
    }, STATUS_UPDATE_INTERVAL_MS);
  }
  render() {

    const { displayedEvents } = this.state;
    const events = displayedEvents.map((event, idx) => {

      return (
        <div className="flex-container schedule-event" key={idx}>
          <EventDuration event={event} />
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
