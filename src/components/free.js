import humanizeDuration from 'humanize-duration';
import { isEmpty } from 'lodash/lang';
import React from 'react';
import Button from './button';

// should be placed in util.js
const humanReadableDuration = (ms) => {
  // largest: max number of units to display, round: round to smallest unit displayed
  return humanizeDuration(ms, { largest: 1, round: true, units: ['d', 'h', 'm'] });
}

const freeStatusSubMessage = (nextEvent) => {
  const remainingTime = humanReadableDuration(Date.parse(nextEvent.start.dateTime) - Date.now());
  return `for the next ${remainingTime}`;
}

const Free = ({ nextEvent, onClick15, onClick30}) => {
  const remainingTimeMessage = isEmpty(nextEvent) ? null : freeStatusSubMessage(nextEvent);

  return (
    <div className='status-details' key={1}>
      <h3>Quick Booking</h3>
      <div className="action-buttons multiple">
        <Button icon="15-min" handleClick={onClick15}/>
        <Button icon="30-min" handleClick={onClick30}/>
      </div>
      <h1>It&lsquo;s free</h1>
      <h2>{remainingTimeMessage}</h2>
    </div>
  );
}

export default Free;
