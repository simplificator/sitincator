import { isEmpty } from 'lodash/lang';
import React from 'react';
import Button from './button';
import { humanReadableDuration, timeLeft } from './../util';

var Gpio = require('onoff').Gpio;
var LED1 = new Gpio(4,'out'),
    LED2 =new Gpio(17,'out');

LED1.writeSync(1);
LED2.writeSync(0);

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
