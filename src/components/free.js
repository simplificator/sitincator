import { isEmpty } from 'lodash/lang';
import React from 'react';
import Button from './button';
import { humanReadableDuration, timeToEvent } from './../util';
import { MILLISECONDS_PER_MINUTE } from './../constants';

const freeStatusSubMessage = (nextEvent) => {
  const remainingTime = humanReadableDuration(timeToEvent(nextEvent));
  return `for the next ${remainingTime}`;
};

const lessThan15MinutesToEvent = (event) => {
  return (!isEmpty(event) && timeToEvent(event) < 15 * MILLISECONDS_PER_MINUTE);
};

const lessThan30MinutesToEvent = (event) => {
  return (!isEmpty(event) && timeToEvent(event) < 30 * MILLISECONDS_PER_MINUTE);
};

const Free = ({ nextEvent, onClick15, onClick30}) => {
  const remainingTimeMessage = isEmpty(nextEvent) ? null : freeStatusSubMessage(nextEvent);

  return (
    <div className='status-details' key={1}>
      <strong> { remote.getGlobal('calendarName') }</strong>
      <h3>Quick Booking</h3>
      <div className="action-buttons multiple">
        <Button
          icon="15-min"
          handleClick={onClick15}
          className={lessThan15MinutesToEvent(nextEvent) ? 'hidden' : '' }
        />
        <Button
          icon="30-min"
          handleClick={onClick30}
          className={lessThan30MinutesToEvent(nextEvent) ? 'hidden' : '' }
        />
      </div>
      <h1>{"It's free"}</h1>
      <h2>{remainingTimeMessage}</h2>
    </div>
  );
};

export default Free;
