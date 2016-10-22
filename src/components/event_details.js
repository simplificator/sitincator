import React, { Component, PropTypes } from 'react';
import Button from './button';
import classNames from 'classnames';

export default class EventDetails extends Component {
  static props = {
    displayedEvent: PropTypes.object,
    expanded: PropTypes.bool,
    handleShowSchedule: PropTypes.func.isRequired,
    handleExpandDetails: PropTypes.func.isRequired,
  }

  static defaultProps = {
    expanded: false,
  };

  handleExpandDetails() {
    this.props.handleExpandDetails();
  }

  render() {
    var duration = 0;

    if (this.props.displayedEvent.id) {
      duration = Date.parse(this.props.displayedEvent.start.dateTime) - Date.now();
    }

    const btnClasses = classNames({
      small: true,
      'expand-btn': true,
      expanded: this.props.expanded,
    });

    return (
      <div className='event-details'>
        <Button icon="arrow-up" className={btnClasses} handleClick={this.handleExpandDetails.bind(this)}/>
        <h3>
          {this.props.displayedEvent.current ? 'Current Meeting' : 'Coming up'}
          <span>{`For the next ${duration}`}</span>
        </h3>
        <p>{this.props.displayedEvent.summary}</p>
      </div>
    );
  }
}
