import React, { Component } from 'react';
import Button from './button';
import { ipcRenderer } from 'electron';
import EventDetails from './event_details';
import classNames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export default class Status extends Component {

  constructor(props) {
    super(props);
    this.handleShowSchedule = this.handleShowSchedule.bind(this);
    this.state = {
      status: 'free',
      detailsExpanded: false,
      displayedEvent: {},
    }
  }

  componentDidMount() {
    ipcRenderer.send('calendar:status-event');

    ipcRenderer.on('calendar:status-event-success', (event, displayedEvent) => {
      this.setState({ displayedEvent });
    })

    ipcRenderer.on('calendar:status-event-error', (event, err) => {
      console.error('An error occurred loading the status event:', err);
    })

    ipcRenderer.on('calendar:quick-reservation-success', (event, displayedEvent) => this.setState({ displayedEvent }));
    ipcRenderer.on('calendar:quick-reservation-failure', (event, error) => console.error(error));

    ipcRenderer.on('calendar:finish-reseveration-success', (event, displayedEvent) => this.setState({ displayedEvent }));
    ipcRenderer.on('calendar:finish-reseveration-failure', (event, error) => console.error(error));

  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners();
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
    ipcRenderer.send('calendar:finish-reseveration', this.state.displayedEvent.id);
  }

  isBooked() {
    const now = Date.now();
    return Object.keys(this.state.displayedEvent).length > 0
      && Date.parse(this.state.displayedEvent.start.dateTime) <= now
      && Date.parse(this.state.displayedEvent.end.dateTime) > now;
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

  renderFree() {
    return (
      <div className='status-details' key={0}>
        <h3>Quick Booking</h3>
        <div className="action-buttons multiple">
          <Button icon="15-min" handleClick={this.handleQuickReservation.bind(this, 15)}/>
          <Button icon="30-min" handleClick={this.handleQuickReservation.bind(this, 30)}/>
        </div>
        <h1>It&lsquo;s {this.state.status}</h1>
      </div>
    );
  }

  renderBooked() {
    return (
      <div className='status-details' key={1}>
        <h3> </h3>
        <div className="action-buttons single">
          <Button icon="cancel" className="big" handleClick={this.handleFinishReservation.bind(this)}/>
        </div>
        <h1>Booked</h1>
      </div>
    );
  }
}
