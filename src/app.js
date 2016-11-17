import React, { Component } from 'react';
import { browserHistory, Router, Route, IndexRoute, Link } from 'react-router'
import { ipcRenderer } from 'electron';
import { nextEvent, nextEventIdx } from './util';

const STATUS_UPDATE_INTERVAL_MS = 60000;
const MILLISECONDS_PER_MINUTE = 60000;

function currentHash() {
  return window.location.hash;
}

function isStatusView() {
  return /status/.test(currentHash());
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { events: [] };
  }

  componentDidMount() {
    ipcRenderer.send('calendar:list-events');
    this.setUpdateDisplayedEventsInterval();

    ipcRenderer.on('calendar:list-events-success', (event, events) => {
      this.setState({events})
    });
    ipcRenderer.on('calendar:list-events-failure', (event, error) => console.error(error));

    ipcRenderer.on('calendar:quick-reservation-success', (event, events) => this.setState({ events }));
    ipcRenderer.on('calendar:quick-reservation-failure', (event, error) => console.error(error));

    ipcRenderer.on('calendar:finish-reservation-success', (event, events) => this.setState({ events }));
    ipcRenderer.on('calendar:finish-reservation-failure', (event, error) => console.error(error));
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners();
    clearInterval(this.updateEventsInterval);
  }

  handleQuickReservation(duration) {
    // duration is in minutes
    if (duration * MILLISECONDS_PER_MINUTE > this.timeToNextEvent()) {
      return
    }
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

  timeToNextEvent() {
    const { events } = this.state;
    return (Date.parse(nextEvent(events).start.dateTime) - Date.now()); // milliseconds
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
          nextEvent: nextEvent(events),
          nextEventIdx: nextEventIdx(events),
          onQuickReservation: this.handleQuickReservation.bind(this),
          onFinishReservation: this.handleFinishReservation.bind(this),
          onShowSchedule: this.handleShowSchedule.bind(this)})
        }
        <footer>
          <div className="footer">
            {isStatusView() ? <Link to="/schedule">{footerText}</Link> : <Link to="/status">{footerText}</Link>}
          </div>
        </footer>
      </div>
    )
  }
}
