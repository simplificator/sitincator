import React, { Component } from 'react';
import { browserHistory, Router, Route, IndexRoute, Link } from 'react-router'
import { ipcRenderer } from 'electron';

const STATUS_UPDATE_INTERVAL_MS = 60000;

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

  nextEvent() {
    const now = new Date().getTime();
    const item = this.state.events.find((e) => {
      const start = new Date(e.start.dateTime).getTime();
      const end = new Date(e.end.dateTime).getTime();
      if (now > start && now < end) {
        e.isCurrent = true
        return true;
      }
      if (now < start) {
        return true;
      };
    });
    return item || {};
  }

  nextEventIdx() {
    const { events } = this.state;

    return events.findIndex((e) => {
      const now = new Date().getTime()
      const start = new Date(e.start.dateTime).getTime();
      const end = new Date(e.end.dateTime).getTime();

      if (now > start && now < end) {
        e.isCurrent = true
        return true;
      }
      if (now < start) {
        return true;
      };
    });
  }

  render() {
    const footerText = isStatusView() ?
      <span>full schedule <i className="icon icon-arrow-right"></i></span> :
      <span><i className="icon icon-arrow-left"></i> back to booking</span>;

    return (
      <div id="app">
        {React.cloneElement(this.props.children, {
          events: this.state.events,
          nextEvent: this.nextEvent(),
          nextEventIdx: this.nextEventIdx(),
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
