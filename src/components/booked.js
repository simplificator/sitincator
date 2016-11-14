import humanizeDuration from 'humanize-duration';
import { isEmpty } from 'lodash/lang';
import React from 'react';
import Button from './button';

// should be placed in util.js
const humanReadableDuration = (ms) => {
  // largest: max number of units to display, round: round to smallest unit displayed
  return humanizeDuration(ms, { largest: 1, round: true });
}

const bookedStatusSubMessage = (nextEvent) => {
  const remainingTime = humanReadableDuration(Date.parse(nextEvent.end.dateTime) - Date.now());
  return `for the next ${remainingTime}`;
}

const Booked = ({ nextEvent, onClick}) => {
  const remainingTimeMessage = isEmpty(nextEvent) ? null : bookedStatusSubMessage(nextEvent);

  return (
    <div className='status-details' key={1}>
      <div className="action-buttons single">
        <Button icon="cancel" className="big" handleClick={onClick}/>
      </div>
      <h1>Booked</h1>
      <h2>{remainingTimeMessage}</h2>
    </div>
  );
}

export default Booked;
