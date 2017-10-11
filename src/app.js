import React, { Component } from 'react';
import { browserHistory, Router, Route, IndexRoute, Link } from 'react-router'
import { ipcRenderer } from 'electron';
import { currentEvent, nextEvent, nextEventIdx } from './util';
import { STATUS_UPDATE_INTERVAL_MS, MILLISECONDS_PER_MINUTE } from './constants';

function currentHash() {
  return window.location.hash;
}

function isStatusView() {
  return /status/.test(currentHash());
}

const isCheckConnectionView = () => {
  return /check_connection/.test(currentHash());
}

// Disable pinch zooming
require('electron').webFrame.setVisualZoomLevelLimits(1, 1);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { events: [] };
  }

  componentDidMount() {
    ipcRenderer.send('calendar:list-events');
    this.setUpdateDisplayedEventsInterval();

    ipcRenderer.on('calendar:list-events-success', (event, events) => {
      if (isCheckConnectionView()) {
        window.location.hash = 'status';
      }
      events = this.processEvents(events);
      this.setState({events})
    });
    ipcRenderer.on('calendar:list-events-failure', (event, error) => {
      window.location.hash = 'check_connection';
    });

    ipcRenderer.on('calendar:quick-reservation-success', (event, events) => this.setState({ events }));
    ipcRenderer.on('calendar:quick-reservation-failure', (event, error) => console.error(error));

    ipcRenderer.on('calendar:finish-reservation-success', (event, events) => this.setState({ events }));
    ipcRenderer.on('calendar:finish-reservation-failure', (event, error) => console.error(error));
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners();
    clearInterval(this.updateEventsInterval);
  }

  processEvents(events) {
    events = this.markAllDayEvents(events);
    events = this.removeUnconfirmedEvents(events);
    return events
  }

  markAllDayEvents(events) {
    return events.map((event) => {
      if (event.start.dateTime) {
        return {
          ...event,
          isAllDay: false,
        }
      } else {  // all day events received from api call don't have the dateTime field
        const start = new Date(event.start.date);
        start.setHours(0);
        const end = new Date(event.end.date);
        end.setHours(0);
        return {
          ...event,
          start: {...event.start, dateTime: start},
          end: {...event.end, dateTime: end},
          isAllDay: true,
        }
      }
    })
  }

  removeUnconfirmedEvents(events) {
    return events.filter(event => {
      return event.status === 'confirmed';
    });
  }

  handleQuickReservation(duration) {
    // duration is in minutes
    // if (duration * MILLISECONDS_PER_MINUTE > this.timeToNextEvent()) {
    //   return
    // }
    ipcRenderer.send('calendar:quick-reservation', duration);
  }

  handleFinishReservation(id) {
    ipcRenderer.send('calendar:finish-reservation', id);
  }

  handleShowSchedule() {
    window.location.hash = 'schedule';
  }

  setUpdateDisplayedEventsInterval() {
    this.updateEventsInterval = setInterval(() => {
      ipcRenderer.send('calendar:list-events');
    }, STATUS_UPDATE_INTERVAL_MS);
  }

  render() {
    const { events } = this.state;
    const footerText = isStatusView() ?
      <span>full schedule <i className="icon icon-arrow-right"></i></span> :
      <span><i className="icon icon-arrow-left"></i> back to booking</span>;

    return (
      <div id="app">
        {React.cloneElement(this.props.children, {
          events,
          currentEvent: currentEvent(events),
          nextEvent: nextEvent(events),
          nextEventIdx: nextEventIdx(events),
          onQuickReservation: this.handleQuickReservation.bind(this),
          onFinishReservation: this.handleFinishReservation.bind(this),
          onShowSchedule: this.handleShowSchedule.bind(this)})
        }
        {this.drawFooter(footerText)}
      </div>
    )
  }

  drawFooter(footerText) {
    if(isCheckConnectionView())
      return '';

    return (
      <footer>
        <div className="footer">
          {isStatusView() ? <Link to="/schedule">{footerText}</Link> : <Link to="/status">{footerText}</Link>}
        </div>
      </footer>
    );
  }
}
