import React, { Component, PropTypes } from 'react';
import EventDetails from './event_details';
import classNames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Free from './free';
import Booked from './booked';
import { isEmpty } from 'lodash/lang';


export default class Status extends Component {
  static propTypes = {
    events: PropTypes.array,
    currentEvent: PropTypes.object,
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
    const { currentEvent } = this.props;
    const now = Date.now();

    return Object.keys(currentEvent).length > 0
      && Date.parse(currentEvent.start.dateTime) <= now
      && Date.parse(currentEvent.end.dateTime) > now;
  }

  render() {
    const { nextEvent, currentEvent, onQuickReservation, onFinishReservation, onShowSchedule } = this.props;
    const { detailsExpanded } = this.state;
    const rootClasses = classNames({
      'status-view': true,
      'expanded': detailsExpanded,
      'booked': this.isBooked(),
    });

    let statusComponent = this.isBooked() ?
      <Booked
        onClick={() => onFinishReservation(currentEvent.id)}
        currentEvent={currentEvent}
        key={1}
      /> :
      <Free
        onClick15={() => onQuickReservation(15)}
        onClick30={() => onQuickReservation(30)}
        nextEvent={nextEvent}
        key={1}
      />;

    let isCurrent = !isEmpty(currentEvent);

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
          event={isEmpty(currentEvent) ? nextEvent : currentEvent}
          isCurrent={isCurrent}
          expanded={detailsExpanded}
          handleExpandDetails={this.handleExpandDetails.bind(this)}
          handleShowSchedule={onShowSchedule}
        />

      </div>
    );
  }
}
