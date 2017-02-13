import { isEmpty } from 'lodash/lang';
import React from 'react';
import Button from './button';
import { humanReadableDuration, timeLeft } from './../util';

const bookedStatusSubMessage = (currentEvent) => {
  const remainingTime = humanReadableDuration(timeLeft(currentEvent));
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
