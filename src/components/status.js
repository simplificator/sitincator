import React, { Component } from 'react';
import Button from './button';
import { ipcRenderer } from 'electron';
import EventDetails from './event_details';
import classNames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import humanizeDuration from 'humanize-duration';
import { isEmpty } from 'lodash/lang';

const STATUS_UPDATE_INTERVAL_MS = 60000;

export default class Status extends Component {

  constructor(props) {
    super(props);
    this.handleShowSchedule = this.handleShowSchedule.bind(this);
    this.setUpdateStatusEventInterval = this.setUpdateStatusEventInterval.bind(this);
    this.state = {
      status: 'free',
      detailsExpanded: false,
      displayedEvent: {},
    }
  }

  componentDidMount() {
    ipcRenderer.send('calendar:status-event');
    this.setUpdateStatusEventInterval();

    ipcRenderer.on('calendar:status-event-success', (event, displayedEvent) => {
      this.setState({ displayedEvent });
    })

    ipcRenderer.on('calendar:status-event-error', (event, err) => {
      console.error('An error occurred loading the status event:', err);
    })

    ipcRenderer.on('calendar:quick-reservation-success', (event, displayedEvent) => this.setState({ displayedEvent }));
    ipcRenderer.on('calendar:quick-reservation-failure', (event, error) => console.error(error));

    ipcRenderer.on('calendar:finish-reservation-success', (event, displayedEvent) => this.setState({ displayedEvent }));
    ipcRenderer.on('calendar:finish-reservation-failure', (event, error) => console.error(error));

    ipcRenderer.on('calendar:list-events-success', (event, events) => console.log(events));
    ipcRenderer.on('calendar:list-events-failure', (event, error) => console.error(error));

  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners();
    clearInterval(this.updateStatusInterval);
  }

  setUpdateStatusEventInterval() {
    this.updateStatusInterval = setInterval(() => {
      ipcRenderer.send('calendar:status-event');
    }, STATUS_UPDATE_INTERVAL_MS);
  }

  handleQuickReservation(duration) {
    ipcRenderer.send('calendar:quick-reservation', duration);
  }

  handleShowSchedule() {
    window.location.hash = 'schedule';
  }

  handleExpandDetails() {
    this.setState({
      detailsExpanded: !this.state.detailsExpanded,
    });
  }

  handleFinishReservation() {
    ipcRenderer.send('calendar:finish-reservation', this.state.displayedEvent.id);
  }

  isBooked() {
    const now = Date.now();
    return Object.keys(this.state.displayedEvent).length > 0
      && Date.parse(this.state.displayedEvent.start.dateTime) <= now
      && Date.parse(this.state.displayedEvent.end.dateTime) > now;
  }

  humanReadableDuration(ms) {
    // largest: max number of units to display, round: round to smallest unit displayed
    return humanizeDuration(ms, { largest: 1, round: true });
  }

  freeStatusSubMessage() {
    const { displayedEvent } = this.state;
    const remainingTime = this.humanReadableDuration(Date.parse(displayedEvent.start.dateTime) - Date.now());
    return `for the next ${remainingTime}`;
  }

  renderFree() {
    const { displayedEvent } = this.state;
    const remainingTimeMessage = isEmpty(displayedEvent) ? null : this.freeStatusSubMessage();

    return (
      <div className='status-details' key={0}>
        <h3>Quick Booking</h3>
        <div className="action-buttons multiple">
          <Button icon="15-min" handleClick={this.handleQuickReservation.bind(this, 15)}/>
          <Button icon="30-min" handleClick={this.handleQuickReservation.bind(this, 30)}/>
        </div>
        <h1>It&lsquo;s {this.state.status}</h1>
        <h2>{remainingTimeMessage}</h2>
      </div>
    );
  }

  bookedStatusSubMessage() {
    const { displayedEvent } = this.state;
    const remainingTime = this.humanReadableDuration(Date.parse(displayedEvent.end.dateTime) - Date.now());
    return `for the next ${remainingTime}`;
  }

  renderBooked() {
    const { displayedEvent } = this.state;
    const remainingTimeMessage = isEmpty(displayedEvent) ? null : this.bookedStatusSubMessage();

    return (
      <div className='status-details' key={1}>
        <h3></h3>
        <div className="action-buttons single">
          <Button icon="cancel" className="big" handleClick={this.handleFinishReservation.bind(this)}/>
        </div>
        <h1>Booked</h1>
        <h2>{remainingTimeMessage}</h2>
      </div>
    );
  }

  render() {
    const rootClasses = classNames({
      'status-view': true,
      'expanded': this.state.detailsExpanded,
      'booked': this.isBooked(),
    });

    const innerComponents = this.isBooked() ? [null, this.renderBooked()] : [this.renderFree(), null];

    return (
      <div className={rootClasses}>
        <ReactCSSTransitionGroup
          transitionName="fade"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          {innerComponents}
        </ReactCSSTransitionGroup>
        <EventDetails
          displayedEvent={this.state.displayedEvent}
          expanded={this.state.detailsExpanded}
          handleExpandDetails={this.handleExpandDetails.bind(this)}
          handleShowSchedule={this.handleShowSchedule}
        />
      </div>
    );
  }
}
