import React, { Component } from 'react';
import Button from './button';
import { ipcRenderer } from 'electron';

export default class Status extends Component {
  handleClick() {
    console.log('Button clicked');
  }

  componentDidMount() {
    ipcRenderer.send('calendar:list-events')

    ipcRenderer.on('calendar:list-events-success', (event, arg) => {
      console.log(arg, "Web")
    })

    ipcRenderer.on('calendar:list-events-error', (event, err) => {
      console.log(err, "Web")
    })
  }

  render() {
    return ( 
      <div>
        <h3>Status</h3>
        <Button icon="15-min" handleClick={this.handleClick.bind(this)}/>
      </div>
    );
  }
}
