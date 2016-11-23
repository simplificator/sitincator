import humanizeDuration from 'humanize-duration';
import { isEmpty } from 'lodash/lang';
import React from 'react';
import Button from './button';
import { humanReadableDuration, timeToEvent } from './../util';

const bookedStatusSubMessage = (nextEvent) => {
  const remainingTime = humanReadableDuration(timeToEvent(nextEvent));
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
