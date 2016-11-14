import React, { Component, PropTypes } from 'react';
import EventDetails from './event_details';
import classNames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Free from './free';
import Booked from './booked';



export default class Status extends Component {
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
    this.state = {
      detailsExpanded: false
    }
  }

  handleExpandDetails() {
    this.setState({
      detailsExpanded: !this.state.detailsExpanded,
    });
  }

  isBooked() {
    const { nextEvent } = this.props;
    const now = Date.now();

    return Object.keys(nextEvent).length > 0
      && Date.parse(nextEvent.start.dateTime) <= now
      && Date.parse(nextEvent.end.dateTime) > now;
  }

  render() {
    const { nextEvent, onQuickReservation, onFinishReservation, onShowSchedule } = this.props;
    const { detailsExpanded } = this.state;
    const rootClasses = classNames({
      'status-view': true,
      'expanded': detailsExpanded,
      'booked': this.isBooked(),
    });

    let statusComponent = this.isBooked() ?
      <Booked
        onClick={() => onFinishReservation(nextEvent.id)}
        nextEvent={nextEvent}
        key={1}
      /> :
      <Free
        onClick15={() => onQuickReservation(15)}
        onClick30={() => onQuickReservation(30)}
        nextEvent={nextEvent}
        key={1}
      />;


    return (
      <div className={rootClasses}>
        <ReactCSSTransitionGroup
          transitionName="fade"
          transitionAppear={true}
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          {statusComponent}
        </ReactCSSTransitionGroup>
        <EventDetails
          nextEvent={nextEvent}
          expanded={detailsExpanded}
          handleExpandDetails={this.handleExpandDetails.bind(this)}
          handleShowSchedule={onShowSchedule}
        />

      </div>
    );
  }
}
