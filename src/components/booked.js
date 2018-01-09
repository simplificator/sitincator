import { isEmpty } from 'lodash/lang';
import React from 'react';
import Button from './button';
import { humanReadableDuration, timeLeft } from './../util';

const bookedStatusSubMessage = (currentEvent) => {
  const remainingTime = humanReadableDuration(timeLeft(currentEvent));
  return `for the next ${remainingTime}`;
}

const Booked = ({ currentEvent, onClick}) => {
  const remainingTimeMessage = isEmpty(currentEvent) ? null : bookedStatusSubMessage(currentEvent);

  return (
    <div className='status-details' key={1}>
      <strong> { remote.getGlobal('calendarName') }</strong>
      <div className="action-buttons single">
        <Button icon="cancel" className="big" handleClick={onClick}/>
      </div>
      <h1>Booked</h1>
      <h2>{remainingTimeMessage}</h2>
    </div>
  );
}

export default Booked;
